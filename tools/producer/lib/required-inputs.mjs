// Required-input gating and degradation.
//
// Framework-generic. Given what a producer declares it consumes, what it declares
// it produces, and which of those inputs this run obtained, it decides which
// outputs may still be produced and which must be recorded Unavailable.
//
// It implements two requirements and invents nothing beside them. STD-0011 R-53
// states that a producer emitting more than one artifact type declares, for each
// required input, the types that require it, and that an unavailable required
// input makes exactly those types Unavailable while the rest are still emitted.
// STD-0010 R-48 fixes the shape that declaration is written in. The disclosure
// carried on a degraded output is the one STD-0011 R-25 requires of a missing
// required input: the absent input type, named.
//
// It holds no artifact type identity, no methodology name, and no knowledge of
// stage ordering, evidence, records, or the subject. Everything it decides, it
// decides from the declaration it is handed.

const REQUIREMENT = ['required', 'optional'];

/**
 * Decide which outputs a run may still produce.
 *
 * consumes    R-48 entries: { type, requirement, required_for? }, in the order the
 *             consumer declares them. That order fixes the order of every list
 *             this function returns, so the result does not depend on how any
 *             caller happens to iterate an object.
 * produces    the artifact type identities the producer declares it emits.
 * available   the input types this run obtained.
 * unavailable { type, reason } for each input it did not, in the order it tried
 *             them. The reason is the consumer's, not this module's.
 *
 * Returns { eligible, degraded }. `eligible` lists the produced types that may
 * execute, in `produces` order. `degraded` maps each remaining type to the
 * completeness state and disclosure it must carry.
 *
 * Throws on a declaration this module may not interpret. R-48 states what a
 * required entry must carry, and a producer that did not carry it has not made a
 * declaration this function can evaluate — guessing would be inventing the
 * dependency the requirement exists to make explicit.
 */
export function evaluateRequiredInputs({ consumes, produces, available = [], unavailable = [] }) {
  if (!Array.isArray(consumes)) throw new TypeError('consumes must be a list of declaration entries');
  if (!Array.isArray(produces) || !produces.length) throw new TypeError('produces must name at least one artifact type');

  const producedSet = new Set(produces);
  const multiOutput = produces.length > 1;

  for (const entry of consumes) {
    if (!entry || typeof entry.type !== 'string' || !entry.type) {
      throw new TypeError('a consumes entry carries no artifact type identity');
    }
    if (!REQUIREMENT.includes(entry.requirement)) {
      throw new TypeError(`${entry.type}: requirement must be "required" or "optional" under STD-0010 R-48, not ${JSON.stringify(entry.requirement)}`);
    }
    if (entry.requirement !== 'required') continue;

    // R-48 obliges required_for only where the producer emits more than one type.
    // With a single output there is one answer and `produces` already carries it.
    if (!multiOutput) continue;

    if (!Array.isArray(entry.required_for) || !entry.required_for.length) {
      throw new TypeError(`${entry.type}: a required input of a producer emitting ${produces.length} types must declare a non-empty required_for under STD-0010 R-48`);
    }
    for (const target of entry.required_for) {
      if (!producedSet.has(target)) {
        throw new TypeError(`${entry.type}: required_for names ${target}, which this producer does not declare in produces`);
      }
    }
  }

  const obtained = new Set(available);
  const reasonOf = new Map(unavailable.map((item) => [item.type, item.reason]));
  const degraded = new Map();

  for (const type of produces) {
    // Scanned in declaration order so that a degraded output names its missing
    // inputs the same way on every run.
    const missing = consumes
      .filter((entry) => entry.requirement === 'required'
        && (multiOutput ? entry.required_for.includes(type) : true)
        && !obtained.has(entry.type))
      .map((entry) => entry.type);
    if (!missing.length) continue;

    // Reasons follow the order the consumer reported its failures in, which is the
    // order it attempted them, not the order the missing inputs are named.
    const reasons = unavailable.filter((item) => missing.includes(item.type)).map((item) => item.reason);
    degraded.set(type, {
      completeness: 'Unavailable',
      reason: `this artifact requires ${missing.join(', ')}, which this run could not obtain: ${reasons.join('; ')}`,
      missing,
    });
  }

  return { eligible: produces.filter((type) => !degraded.has(type)), degraded };
}

/**
 * The input types a consumes declaration names, in declaration order.
 *
 * An optional input is one the producer consumes and no output requires. Its
 * absence lowers confidence under STD-0011 R-22 and degrades nothing, and R-48
 * still obliges it to be declared: "not required" is a statement a consumer is
 * entitled to read rather than infer from silence.
 */
export function consumedTypes(consumes) {
  return consumes.map((entry) => entry.type);
}
