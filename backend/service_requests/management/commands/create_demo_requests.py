from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
import random

from buyers.models import BuyerProfile
from service_requests.models import ServiceRequest


class Command(BaseCommand):
    help = "Create demo service requests for a given username (default: 5)."

    def add_arguments(self, parser):
        parser.add_argument('--username', required=True, help='Username to attach the service requests to')
        parser.add_argument('--count', type=int, default=5, help='Number of demo requests to create (default: 5)')

    def handle(self, *args, **options):
        username = options['username']
        count = options['count']

        User = get_user_model()
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # Create a buyer user if not found
            user = User.objects.create_user(
                username=username,
                password='password123',
                email=f'{username}@example.com',
                role='buyer'
            )
            self.stdout.write(self.style.WARNING(f"User '{username}' not found. Created a new buyer user with default password 'password123'."))

        # Ensure buyer profile exists
        buyer_profile, created = BuyerProfile.objects.get_or_create(
            user=user,
            defaults={
                'company_name': f'{username} Co.',
                'industry': 'Manufacturing',
                'locations': ['Berlin, DE'],
                'contact_person_name': username.capitalize(),
                'contact_person_position': 'Manager',
                'company_size': '11-50',
                'machines': ['Industrial Robot', 'CNC Machine'],
                'optional_service_requirements': [],
                'qualifications_needed': ['Certified Technician'],
                'safety_requirements': ['PPE required'],
                'additional_info': 'Auto-generated demo buyer profile.'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Created BuyerProfile for '{username}'."))

        titles = [
            'Robot Arm Maintenance',
            'CNC Spindle Inspection',
            'Conveyor Belt Calibration',
            'Hydraulics Leakage Diagnosis',
            'PLC Firmware Update'
        ]
        machine_types = [
            'Industrial Robot', 'CNC Machine', 'Conveyor System', 'Hydraulic Press', 'PLC Controller'
        ]
        service_types_choices = [
            ['Maintenance'], ['Inspection'], ['Repair'], ['Installation'], ['Calibration']
        ]
        urgency_choices = ['low', 'normal', 'high']
        payment_methods = ['bank_transfer', 'card', 'invoice']

        created_count = 0
        today = timezone.now().date()

        for i in range(count):
            title = titles[i % len(titles)] + f" #{i+1}"
            machine_type = machine_types[i % len(machine_types)]
            serial_number = f"SN-{random.randint(10000, 99999)}"
            service_types = service_types_choices[i % len(service_types_choices)]
            urgency = urgency_choices[i % len(urgency_choices)]
            budget = Decimal(random.choice(["750.00", "1200.00", "2000.00", "3500.00"]))
            preferred_date = today + timezone.timedelta(days=(i + 1) * 2)
            alt_dates = [str(preferred_date + timezone.timedelta(days=3)), str(preferred_date + timezone.timedelta(days=7))]
            payment = payment_methods[i % len(payment_methods)]

            req = ServiceRequest.objects.create(
                buyer=buyer_profile,
                title=title,
                machine_type=machine_type,
                serial_number=serial_number,
                locations=['Berlin, DE'],
                customer_company_name=buyer_profile.company_name,
                customer_address='123 Demo Street, Berlin',
                contact_person_name=buyer_profile.contact_person_name,
                contact_person_position=buyer_profile.contact_person_position,
                contact_email=f'{username}@example.com',
                contact_phone='+49 30 123456',
                service_types=service_types,
                has_maintenance_history=bool(i % 2),
                history_notes='Previous work completed last year.' if i % 2 else '',
                issue_description='Auto-generated demo issue description for testing workflows.',
                technician_requirements=['5+ years experience', machine_type],
                safety_requirements=['Lockout/Tagout', 'PPE required'],
                urgency=urgency,
                preferred_date=preferred_date,
                alternative_dates=alt_dates,
                budget_eur=budget,
                payment_method=payment,
                status='open'
            )
            created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Created {created_count} demo service request(s) for user '{username}'."))
