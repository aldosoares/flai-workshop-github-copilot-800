from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, LeaderBoard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        LeaderBoard.objects.all().delete()
        Workout.objects.all().delete()

        # Create Users (Superheroes)
        self.stdout.write('Creating users...')
        users_data = [
            {'name': 'Tony Stark', 'email': 'ironman@avengers.com', 'password': 'ironman123', 'team': 'Team Marvel'},
            {'name': 'Steve Rogers', 'email': 'cap@avengers.com', 'password': 'cap123', 'team': 'Team Marvel'},
            {'name': 'Thor Odinson', 'email': 'thor@avengers.com', 'password': 'thor123', 'team': 'Team Marvel'},
            {'name': 'Bruce Wayne', 'email': 'batman@justiceleague.com', 'password': 'batman123', 'team': 'Team DC'},
            {'name': 'Clark Kent', 'email': 'superman@justiceleague.com', 'password': 'superman123', 'team': 'Team DC'},
            {'name': 'Diana Prince', 'email': 'wonderwoman@justiceleague.com', 'password': 'ww123', 'team': 'Team DC'},
        ]
        users = []
        for u in users_data:
            user = User.objects.create(**u)
            users.append(user)
            self.stdout.write(f'  Created user: {user.name}')

        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            members=['Tony Stark', 'Steve Rogers', 'Thor Odinson']
        )
        team_dc = Team.objects.create(
            name='Team DC',
            members=['Bruce Wayne', 'Clark Kent', 'Diana Prince']
        )
        self.stdout.write(f'  Created team: {team_marvel.name}')
        self.stdout.write(f'  Created team: {team_dc.name}')

        # Create Activities
        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': 'Tony Stark', 'activity_type': 'Flying in Iron Man Suit', 'duration': 60.0, 'date': date(2024, 1, 10)},
            {'user': 'Steve Rogers', 'activity_type': 'Shield Throwing', 'duration': 45.0, 'date': date(2024, 1, 11)},
            {'user': 'Thor Odinson', 'activity_type': 'Hammer Training', 'duration': 90.0, 'date': date(2024, 1, 12)},
            {'user': 'Bruce Wayne', 'activity_type': 'Martial Arts', 'duration': 120.0, 'date': date(2024, 1, 10)},
            {'user': 'Clark Kent', 'activity_type': 'Super Speed Running', 'duration': 30.0, 'date': date(2024, 1, 11)},
            {'user': 'Diana Prince', 'activity_type': 'Lasso Training', 'duration': 75.0, 'date': date(2024, 1, 12)},
        ]
        for a in activities_data:
            activity = Activity.objects.create(**a)
            self.stdout.write(f'  Created activity: {activity.user} - {activity.activity_type}')

        # Create LeaderBoard entries
        self.stdout.write('Creating leaderboard...')
        leaderboard_data = [
            {'user': 'Tony Stark',    'score': 950, 'team': 'Team Marvel', 'calories': 600.0},
            {'user': 'Thor Odinson',  'score': 900, 'team': 'Team Marvel', 'calories': 900.0},
            {'user': 'Clark Kent',    'score': 880, 'team': 'Team DC',     'calories': 300.0},
            {'user': 'Diana Prince',  'score': 860, 'team': 'Team DC',     'calories': 750.0},
            {'user': 'Steve Rogers',  'score': 840, 'team': 'Team Marvel', 'calories': 450.0},
            {'user': 'Bruce Wayne',   'score': 820, 'team': 'Team DC',     'calories': 1200.0},
        ]
        for lb in leaderboard_data:
            entry = LeaderBoard.objects.create(**lb)
            self.stdout.write(f'  Created leaderboard entry: {entry.user} - {entry.score} ({entry.team}, {entry.calories} cal)')

        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {'name': 'Repulsor Beam Training', 'description': 'Arm and shoulder exercises inspired by Iron Man', 'duration': 45.0},
            {'name': 'Super Soldier Circuit', 'description': 'Full body workout based on Captain America training', 'duration': 60.0},
            {'name': 'Asgardian Strength Training', 'description': 'Heavy lifting routine fit for a god', 'duration': 90.0},
            {'name': 'Dark Knight Conditioning', 'description': 'Batman-style martial arts and endurance training', 'duration': 120.0},
            {'name': 'Kryptonian Speed Drills', 'description': 'High-speed interval training like Superman', 'duration': 30.0},
            {'name': 'Amazonian Warrior Workout', 'description': 'Combat-based fitness routine from Themyscira', 'duration': 75.0},
        ]
        for w in workouts_data:
            workout = Workout.objects.create(**w)
            self.stdout.write(f'  Created workout: {workout.name}')

        self.stdout.write(self.style.SUCCESS('Successfully populated octofit_db with test data!'))
