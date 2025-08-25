from django.core.management.base import BaseCommand
from users.models import User
from buyers.models import BuyerProfile
from providers.models import ProviderProfile

class Command(BaseCommand):
    help = 'Create missing buyer/provider profiles for existing users'

    def handle(self, *args, **options):
        users_updated = 0
        
        for user in User.objects.all():
            if user.role == 'buyer':
                if not hasattr(user, 'buyerprofile'):
                    BuyerProfile.objects.create(
                        user=user,
                        company_name='',
                        industry='',
                        contact_person_name=user.username,
                    )
                    self.stdout.write(f'Created buyer profile for {user.username}')
                    users_updated += 1
            elif user.role == 'provider':
                if not hasattr(user, 'providerprofile'):
                    ProviderProfile.objects.create(
                        user=user,
                        company_name='',
                        base_location='',
                        education='',
                        years_experience=0,
                        services_offered=[],
                        hourly_rate_eur=0.00,
                    )
                    self.stdout.write(f'Created provider profile for {user.username}')
                    users_updated += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {users_updated} users')
        )
