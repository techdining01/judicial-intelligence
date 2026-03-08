import logging
from django.core.management.base import BaseCommand
from intelligence.models import AIVideoSimulation

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Seed the database with AI Video Simulations for junior lawyers"

    def handle(self, *args, **options):
        simulations = [
            # 5 Constitutional Cases
            {
                "title": "Constitutional Defect in Federal Executive Power",
                "description": "SANs debating the constitutional limits of executive orders regarding the deployment of armed forces.",
                "category": "Constitutional",
                "video_url": "https://example.com/videos/case1.mp4",
                "ai_prompt_used": "Using Section 217 and Section 218 of the 1999 Constitution of the Federal Republic of Nigeria, simulate an oral argument before the Supreme Court."
            },
            {
                "title": "Fundamental Rights Enforcement: Freedom of Speech",
                "description": "A high-stakes debate on whether an agency's ban on a journalist violates fundamental human rights.",
                "category": "Constitutional",
                "video_url": "https://example.com/videos/case2.mp4",
                "ai_prompt_used": "Referencing Section 39 of the 1999 Constitution of Nigeria, generate the defense for freedom of expression against a gag order by an executive agency."
            },
            {
                "title": "Jurisdictional Dispute: State vs. Federal Courts",
                "description": "SANs argue over original jurisdiction in a dispute involving state revenues and federal allocation.",
                "category": "Constitutional",
                "video_url": "https://example.com/videos/case3.mp4",
                "ai_prompt_used": "Simulate an argument using Section 251 and Section 232 of the Constitution on original jurisdiction over revenue allocation disputes."
            },
            {
                "title": "Electoral Mandate and the Constitution",
                "description": "Simulation of an election petition tribunal appeal at the Supreme Court concerning qualification guidelines.",
                "category": "Constitutional",
                "video_url": "https://example.com/videos/case4.mp4",
                "ai_prompt_used": "Train the voices and arguments on the qualification criteria under Section 131 and 137 of the Nigerian Constitution."
            },
            {
                "title": "Impeachment Proceedings and Fair Hearing",
                "description": "A case reviewing the constitutional validity of a State Governor's impeachment procedure.",
                "category": "Constitutional",
                "video_url": "https://example.com/videos/case5.mp4",
                "ai_prompt_used": "Base the arguments purely on Section 188 of the Constitution regarding impeachment, focusing on the right to fair hearing under Section 36."
            },
            # 3 Civil and Criminal Cases
            {
                "title": "Breach of Contract in Mergers & Acquisitions",
                "description": "A fierce civil litigation simulation involving corporate liability and specific performance.",
                "category": "Civil",
                "video_url": "https://example.com/videos/case6.mp4",
                "ai_prompt_used": "Use the principles of the Companies and Allied Matters Act and general contract law to simulate a civil defense."
            },
            {
                "title": "Criminal Defense: Armed Robbery and Alibi",
                "description": "A SAN defending a client accused of armed robbery, heavily relying on the defense of alibi.",
                "category": "Criminal",
                "video_url": "https://example.com/videos/case7.mp4",
                "ai_prompt_used": "Simulate cross-examination on an alibi defense under the Evidence Act and Section 36(5) (presumption of innocence) of the Constitution."
            },
            {
                "title": "Economic and Financial Crimes: Money Laundering",
                "description": "Simulation of a complex financial crime trial focusing on tracing illicit funds.",
                "category": "Criminal",
                "video_url": "https://example.com/videos/case8.mp4",
                "ai_prompt_used": "Incorporate principles from the Money Laundering (Prevention and Prohibition) Act along with constitutional fair trial guarantees."
            }
        ]

        count = 0
        for sim_data in simulations:
            obj, created = AIVideoSimulation.objects.get_or_create(
                title=sim_data["title"],
                defaults=sim_data
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} AI Video Simulations'))
