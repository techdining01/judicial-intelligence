def normalize_case(raw):
    return {
        "court": raw["court"],
        "case_number": raw["case_number"],
        "title": raw["parties"],
        "hearing_date": raw["date"],
    }
