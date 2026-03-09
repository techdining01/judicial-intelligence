from .lagos import LagosSmallClaimsRule
from .oyo import OyoSmallClaimsRule
from .rivers import RiversSmallClaimsRule
from .osun import OsunSmallClaimsRule
from .kano import KanoSmallClaimsRule
from .kwara import KwaraSmallClaimsRule
from .edo import EdoSmallClaimsRule
from .enugu import EnuguSmallClaimsRule
from .anambra import AnambraSmallClaimsRule
from .ogun import OgunSmallClaimsRule
from .ekiti import EkitiSmallClaimsRule
from .kaduna import KadunaSmallClaimsRule
from .fct import FCTSmallClaimsRule
from .abia import AbiaSmallClaimsRule
from .adamawa import AdamawaSmallClaimsRule
from .akwa_ibom import AkwaIbomSmallClaimsRule
from .bauchi import BauchiSmallClaimsRule
from .bayelsa import BayelsaSmallClaimsRule
from .benue import BenueSmallClaimsRule
from .borno import BornoSmallClaimsRule
from .cross_river import CrossRiverSmallClaimsRule
from .delta import DeltaSmallClaimsRule
from .ebonyi import EbonyiSmallClaimsRule
from .gombe import GombeSmallClaimsRule
from .imo import ImoSmallClaimsRule
from .jigawa import JigawaSmallClaimsRule
from .katsina import KatsinaSmallClaimsRule
from .kebbi import KebbiSmallClaimsRule
from .kogi import KogiSmallClaimsRule
from .nasarawa import NasarawaSmallClaimsRule
from .niger import NigerSmallClaimsRule
from .ondo import OndoSmallClaimsRule
from .plateau import PlateauSmallClaimsRule
from .sokoto import SokotoSmallClaimsRule
from .taraba import TarabaSmallClaimsRule
from .yobe import YobeSmallClaimsRule
from .zamfara import ZamfaraSmallClaimsRule

def _normalize_state(state: str) -> str:
    """Normalize state name for lookup: 'Akwa Ibom' -> 'akwa_ibom'."""
    if not state:
        return ""
    return state.strip().lower().replace(" ", "_").replace("-", "_")

# All 36 states + FCT (37 jurisdictions). Module-level so RULES and resolve_rules both use it.
MAPPING = {
    "lagos": LagosSmallClaimsRule(),
    "oyo": OyoSmallClaimsRule(),
    "rivers": RiversSmallClaimsRule(),
    "osun": OsunSmallClaimsRule(),
    "kano": KanoSmallClaimsRule(),
    "kwara": KwaraSmallClaimsRule(),
    "edo": EdoSmallClaimsRule(),
    "enugu": EnuguSmallClaimsRule(),
    "anambra": AnambraSmallClaimsRule(),
    "ogun": OgunSmallClaimsRule(),
    "ekiti": EkitiSmallClaimsRule(),
    "kaduna": KadunaSmallClaimsRule(),
    "fct": FCTSmallClaimsRule(),
    "abia": AbiaSmallClaimsRule(),
    "adamawa": AdamawaSmallClaimsRule(),
    "akwa_ibom": AkwaIbomSmallClaimsRule(),
    "bauchi": BauchiSmallClaimsRule(),
    "bayelsa": BayelsaSmallClaimsRule(),
    "benue": BenueSmallClaimsRule(),
    "borno": BornoSmallClaimsRule(),
    "cross_river": CrossRiverSmallClaimsRule(),
    "delta": DeltaSmallClaimsRule(),
    "ebonyi": EbonyiSmallClaimsRule(),
    "gombe": GombeSmallClaimsRule(),
    "imo": ImoSmallClaimsRule(),
    "jigawa": JigawaSmallClaimsRule(),
    "katsina": KatsinaSmallClaimsRule(),
    "kebbi": KebbiSmallClaimsRule(),
    "kogi": KogiSmallClaimsRule(),
    "nasarawa": NasarawaSmallClaimsRule(),
    "niger": NigerSmallClaimsRule(),
    "ondo": OndoSmallClaimsRule(),
    "plateau": PlateauSmallClaimsRule(),
    "sokoto": SokotoSmallClaimsRule(),
    "taraba": TarabaSmallClaimsRule(),
    "yobe": YobeSmallClaimsRule(),
    "zamfara": ZamfaraSmallClaimsRule(),
}

RULES = dict(MAPPING)

def resolve_rules(state: str):
    return MAPPING.get(_normalize_state(state))

def validate_small_claim(state, amount):
    rule = RULES.get(_normalize_state(state)) if state else None
    if not rule:
        return False, "No small claims rule defined"

    if not rule.validate(amount):
        return False, f"Exceeds ₦{rule.max_amount}"

    return True, "Valid small claims case"
