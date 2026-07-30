// Consumption profile resolution and projection.
//
// Framework-generic. A profile is addressed to a consumer kind, not to a
// producer, so the consumer identity is data this module is handed rather than a
// constant it holds. It knows no methodology and no artifact type.
//
// STD-0011 R-30 makes the profile the unit of compatibility where a consumer
// declares one. Making it the unit of *access* is what keeps that honest: a
// consumer that reached for a field its profile does not name finds nothing
// there, so an accidental dependency is a TypeError rather than a review finding.

/**
 * The consumption profile a type declares for a named consumer, or null.
 *
 * STD-0013 R-23 requires every profile to carry `consumer` and `reads`; R-25
 * requires every entry in `reads` to be a declared field of the type. Both are
 * validated against the corpus already, so this reads the declaration as data.
 */
export function profileFor(declaration, consumer) {
  const profiles = Array.isArray(declaration?.consumption_profiles) ? declaration.consumption_profiles : [];
  const entry = profiles.find((p) => p && p.consumer === consumer);
  if (!entry) return null;
  const reads = Array.isArray(entry.reads)
    ? entry.reads
    : String(entry.reads ?? '').split(',').map((f) => f.trim()).filter(Boolean);
  return { consumer: entry.consumer, reads };
}

/**
 * Project an artifact's records onto the fields its profile declares.
 *
 * What comes back carries the profile fields and nothing else. Evidence state,
 * confidence, and load-bearing are carried regardless: they are framework
 * properties of a record rather than fields a profile grants, and propagation
 * under STD-0007 R-26 needs them.
 */
export function projectThroughProfile(artifact, profile) {
  return artifact.body.records.map((record) => {
    const visible = {};
    for (const field of profile.reads) {
      if (record.fields?.[field] !== undefined) visible[field] = record.fields[field];
    }
    return {
      record_id: record.record_id,
      fields: visible,
      evidence_state: record.fields?.evidence_state,
      confidence: record.fields?.confidence,
      load_bearing: record.load_bearing !== false,
    };
  });
}

/**
 * Whether every field a profile reads is still a field its type declares.
 *
 * STD-0011 R-30 evaluates compatibility over the profile and not over the whole
 * type, so a field the type no longer declares is the narrowing R-32 classifies
 * as breaking — detectable without reading a single record.
 */
export function profileFieldsDeclared(declaration, profile) {
  const declared = new Set([
    ...(Array.isArray(declaration.required_fields) ? declaration.required_fields : []),
    ...(Array.isArray(declaration.optional_fields) ? declaration.optional_fields : []),
  ]);
  return profile.reads.filter((field) => !declared.has(field));
}
