def aggregate_risk(precedent, evidence, procedure):
    """
    Weighted risk aggregation
    """

    return round(
        (precedent * 0.4) +
        (evidence * 0.4) +
        (procedure * 0.2),
        2
    )
