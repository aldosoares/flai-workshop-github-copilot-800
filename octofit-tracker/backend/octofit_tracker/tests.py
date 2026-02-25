from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, LeaderBoard, Workout
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Tony Stark',
            email='ironman@avengers.com',
            password='ironman123'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Tony Stark')
        self.assertEqual(self.user.email, 'ironman@avengers.com')

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Tony Stark')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=['Tony Stark', 'Steve Rogers', 'Thor Odinson']
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Team Marvel')

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Tony Stark',
            activity_type='Flying in Iron Man Suit',
            duration=60.0,
            date=date(2024, 1, 10)
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user, 'Tony Stark')
        self.assertEqual(self.activity.activity_type, 'Flying in Iron Man Suit')

    def test_activity_str(self):
        self.assertEqual(str(self.activity), 'Tony Stark - Flying in Iron Man Suit')


class LeaderBoardModelTest(TestCase):
    def setUp(self):
        self.entry = LeaderBoard.objects.create(
            user='Tony Stark',
            score=950
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.user, 'Tony Stark')
        self.assertEqual(self.entry.score, 950)

    def test_leaderboard_str(self):
        self.assertEqual(str(self.entry), 'Tony Stark - 950')


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Repulsor Beam Training',
            description='Arm and shoulder exercises inspired by Iron Man',
            duration=45.0
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Repulsor Beam Training')
        self.assertEqual(self.workout.duration, 45.0)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Repulsor Beam Training')


class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Steve Rogers',
            email='cap@avengers.com',
            password='cap123'
        )

    def test_get_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'name': 'Thor Odinson', 'email': 'thor@avengers.com', 'password': 'thor123'}
        response = self.client.post('/api/users/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team DC',
            members=['Bruce Wayne', 'Clark Kent']
        )

    def test_get_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Bruce Wayne',
            activity_type='Martial Arts',
            duration=120.0,
            date=date(2024, 1, 10)
        )

    def test_get_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderBoardAPITest(APITestCase):
    def setUp(self):
        self.entry = LeaderBoard.objects.create(
            user='Clark Kent',
            score=880
        )

    def test_get_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Dark Knight Conditioning',
            description='Batman-style martial arts and endurance training',
            duration=120.0
        )

    def test_get_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_root_prefix(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
