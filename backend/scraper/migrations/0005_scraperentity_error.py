# Generated by Django 3.2.5 on 2021-08-01 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scraper', '0004_remove_scraperentity_html'),
    ]

    operations = [
        migrations.AddField(
            model_name='scraperentity',
            name='error',
            field=models.BooleanField(default=False),
        ),
    ]
