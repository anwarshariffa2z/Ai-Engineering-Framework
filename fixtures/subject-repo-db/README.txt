orders-db
=========

A deterministic fixture subject for the composed Architecture Discovery and
Database Discovery reference run. It is a subject, not a working service: the
sources are read by the reference producers and are never executed, installed,
or connected to a database.

The schema is pushed rather than migrated. That is deliberate: it gives the
Database Discovery methodology a subject whose schema change is not managed by a
migration mechanism, which is a material finding rather than an omission.
