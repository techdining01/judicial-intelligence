from alerts.models import AlertSubscription


def get_subscribed_users(case):
    subs = AlertSubscription.objects.filter(
        active=True
    )

    users = []
    for sub in subs:
        if sub.court and sub.court != case.court.name:
            continue
        if sub.keywords:
            if not any(k.lower() in case.title.lower() for k in sub.keywords):
                continue
        users.append(sub.user)

    return users
