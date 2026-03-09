from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Create a test user for development'

    def handle(self, *args, **options):
        if not User.objects.filter(email='test@example.com').exists():
            user = User.objects.create_user(
                email='test@example.com',
                password='password123',
                full_name='Test User',
                role='LAWYER'
            )
            self.stdout.write(self.style.SUCCESS(f'Created test user: {user.email}'))
        else:
            self.stdout.write(self.style.WARNING('Test user already exists'))