Orders service. A deterministic fixture subject for the AUD-0002 reference producer.

Layout:
  src/api      interface layer
  src/domain   domain layer
  src/data     data layer
  config       configuration defaults
  .ci          build pipeline definition
  restricted   deployment definitions held outside the audit's authorization boundary

This fixture exists to exercise framework contracts. It is not a real service and
is never executed by the producer.
