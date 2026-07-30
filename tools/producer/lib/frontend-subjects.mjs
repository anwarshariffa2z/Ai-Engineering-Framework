// AUD-0004 subject profiles.
//
// The conclusions Frontend Discovery reaches about one subject. Data, not logic:
// the methodology that shapes it into artifacts is frontend-discovery.mjs, and
// the framework rules that shape those artifacts are the sibling generic modules.
//
// The subject is a client with no build step, which is what makes it useful. It
// produces an observed-empty artifact honestly — `assets` is Complete with no
// record because there is no bundler, no build output, and no static asset
// directory to find, not because nothing was looked for. It produces a
// NotApplicable one for the same kind of reason: the client holds no state
// container at all. Neither is the same as the Unavailable a withheld input
// causes, and none of the three is Unknown.
//
// AUD-0004 section 8 governs what may be concluded. A defined route is evidence
// that a route exists; only a navigation reference is evidence that a user
// reaches it. A guard in the client is a rendering decision and not an
// authorization control. Reuse is an import count, not a shared directory.

export const SUBJECTS = {
  'storefront-client': {
    declaredScope: 'every path in the subject repository at the audited revision that declares, renders, routes, or configures the delivered client',
    exclusions: [],

    // Stage 1. One independently delivered client. The entry declaration comes
    // from the upstream entrypoints artifact rather than being re-derived here,
    // which is what makes the dependency real.
    surface: {
      completeness: 'Complete',
      lineage: [['framework.architecture.entrypoints', ['surface-0001']]],
      records: [
        {
          fields: {
            client: 'storefront-client',
            platform: 'browser',
            build_unit: 'the package itself; the browser loads the ES modules as authored',
            owning_module: 'src',
            delivery_target: 'a static file host serving the repository root',
            support_matrix: 'unknown',
            evidence_state: 'Observed',
            confidence: 'Medium',
          },
          evidence: [
            ['package.json', 'one package declaring a module type and one main entry, and no second deliverable in scope'],
            ['index.html', 'a single document loading one module entry point'],
          ],
        },
      ],
    },

    // Stage 2. Partial, and the boundary is recorded: one route is constructed
    // at call time from a facet value, so its resulting paths are not enumerable
    // from source. Section 8 forbids inventing them, and the construction site is
    // recorded instead.
    routing: {
      completeness: 'Partial',
      completenessReason: 'one route is constructed at call time from a catalogue facet; the construction site is recorded and the resulting paths are not enumerated, per AUD-0004 section 8 principle 1',
      records: [
        {
          fields: {
            route: '/',
            client: 'storefront-client',
            declaration_path: 'src/routes/routes.js',
            entry_component: 'CatalogueView',
            reachability: 'referenced',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['src/routes/routes.js', 'the route is registered explicitly in the router table'],
            ['index.html', 'a navigation anchor targets this path'],
          ],
        },
        {
          fields: {
            route: '/orders/:orderId',
            client: 'storefront-client',
            declaration_path: 'src/routes/routes.js',
            entry_component: 'OrderView',
            guard: 'requiresSignedIn',
            reachability: 'referenced',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['src/routes/routes.js', 'the route is registered explicitly and declares a guard'],
            ['src/components/product-card.js', 'an anchor constructs this path from an item identifier'],
          ],
        },
        {
          fields: {
            route: '/admin/settings',
            client: 'storefront-client',
            declaration_path: 'src/routes/routes.js',
            entry_component: 'AdminView',
            guard: 'requiresStaff',
            reachability: 'unreferenced',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['src/routes/routes.js', 'the route is registered explicitly'],
            ['src', 'no navigation reference to this path was found within the declared scope'],
          ],
        },
        {
          // The construction site is the finding. Which paths it yields cannot be
          // established without executing the client, which section 2 forbids.
          unknown: 'the resulting paths depend on facet values supplied at run time, and the methodology does not execute the client',
          fields: {
            route: 'constructed at src/routes/routes.js facetRoute',
            client: 'storefront-client',
            declaration_path: 'src/routes/routes.js',
            reachability: 'constructed',
          },
          evidence: [['src/routes/routes.js', 'a function returns a path built from a caller-supplied facet']],
        },
      ],
    },

    // Stage 3. Reuse is measured. ProductCard has one importer, not two, and a
    // shared directory is not evidence of a design system.
    components: {
      completeness: 'Complete',
      records: [
        {
          fields: {
            component: 'CatalogueView',
            declaration_path: 'src/components/catalogue-view.js',
            responsibility: 'renders the catalogue and fetches the items it renders',
            import_count: 1,
            render_role: 'container',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['src/components/catalogue-view.js', 'one exported function declaring its inputs'],
            ['src/routes/routes.js', 'imported once, by the router table'],
          ],
        },
        {
          fields: {
            component: 'ProductCard',
            declaration_path: 'src/components/product-card.js',
            responsibility: 'renders one product and the link to its order',
            import_count: 1,
            render_role: 'presentational',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['src/components/product-card.js', 'one exported function that fetches nothing and renders its inputs'],
            ['src/components/catalogue-view.js', 'imported once'],
          ],
        },
        {
          fields: {
            component: 'OrderView',
            declaration_path: 'src/components/order-view.js',
            responsibility: 'renders one order and fetches it',
            import_count: 1,
            render_role: 'container',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['src/components/order-view.js', 'one exported function reading the order it was routed to'],
            ['src/routes/routes.js', 'imported once, by the router table'],
          ],
        },
        {
          fields: {
            component: 'AdminView',
            declaration_path: 'src/components/admin-view.js',
            responsibility: 'renders the staff settings surface',
            import_count: 1,
            render_role: 'presentational',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['src/components/admin-view.js', 'one exported function branching on a supplied profile'],
            ['src/routes/routes.js', 'imported once, by the router table'],
          ],
        },
      ],
    },

    // Stage 4. A determination about the subject: there is no state container to
    // find. Not an examination that failed, and not an absence of evidence.
    state: {
      completeness: 'NotApplicable',
      completenessReason: 'the client declares no store, no context provider, no persistence, and no subscription; every component receives what it renders as an input',
      records: [],
    },

    // Stage 5. Every call site reaches the service through one module, so the
    // target interface is declared in one place. The upstream integrations
    // artifact is what names the interface.
    dataflow: {
      completeness: 'Complete',
      lineage: [['framework.architecture.integrations', ['dataflow-0001', 'dataflow-0002']]],
      records: [
        {
          fields: {
            call_site: 'src/components/catalogue-view.js CatalogueView',
            target_interface: 'the catalogue read path of the upstream service integration',
            trigger: 'render',
            caching: 'none declared',
            error_handling: 'none declared at the call site; a failure surfaces to the caller',
            optimistic_update: 'none',
            evidence_state: 'Observed',
            confidence: 'Medium',
          },
          evidence: [
            ['src/components/catalogue-view.js', 'the component calls the shared read helper during render'],
            ['src/api/client.js', 'one helper builds the target from a configured base and a path'],
          ],
        },
        {
          fields: {
            call_site: 'src/components/order-view.js OrderView',
            target_interface: 'the order read path of the upstream service integration',
            trigger: 'render',
            caching: 'none declared',
            error_handling: 'none declared at the call site; a failure surfaces to the caller',
            optimistic_update: 'none',
            evidence_state: 'Observed',
            confidence: 'Medium',
          },
          evidence: [
            ['src/components/order-view.js', 'the component calls the shared read helper during render'],
            ['src/api/client.js', 'the same helper serves every call site in the client'],
          ],
        },
      ],
    },

    // Stage 6. Observed empty. The scope was examined in full and there is no
    // bundler configuration, no build output, and no static asset directory. The
    // absence is a finding about this subject and is interpretable because the
    // scope is declared.
    assets: {
      completeness: 'Complete',
      records: [],
    },

    // Stage 7. Inspected, not automated: no accessibility tooling output was
    // supplied, and section 8 principle 5 forbids reporting declared support as
    // tested support.
    accessibility: {
      completeness: 'Complete',
      records: [
        {
          fields: {
            observation: 'the catalogue surface declares a main landmark and an accessible name',
            standard: 'WCAG 2.1',
            location: 'src/components/catalogue-view.js',
            method: 'inspected',
            evidence_state: 'Observed',
            confidence: 'Medium',
          },
          evidence: [['src/components/catalogue-view.js', 'a main element carrying a role and an accessible label']],
        },
        {
          fields: {
            observation: 'a control in the staff surface is a non-semantic element carrying a click handler, with no role and no keyboard handler',
            standard: 'WCAG 2.1',
            location: 'src/components/admin-view.js',
            method: 'inspected',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [['src/components/admin-view.js', 'a div declaring a click handler and no role, tabindex, or key handler']],
        },
        {
          fields: {
            observation: 'whether the product image carries a text alternative could not be established',
            standard: 'WCAG 2.1',
            location: 'src/components/product-card.js',
            method: 'inspected',
          },
          unknown: 'the image attributes are supplied by the item record at run time and no alternative-text attribute is declared in source',
          evidence: [['src/components/product-card.js', 'an image element whose attributes are built from a supplied item']],
        },
      ],
    },

    // Stage 8. Classification and location only. No value, no endpoint, and no
    // identifier content reaches the artifact, per AUD-0004 section 2.
    exposure: {
      completeness: 'Complete',
      records: [
        {
          fields: {
            item_class: 'configuration-value',
            location: 'src/config/public-config.js',
            established_from: 'source',
            inlining_mechanism: 'the client has no build step, so the authored module is the delivered module',
            redaction_marker: 'value withheld',
            gating: 'unknown',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [['src/config/public-config.js', 'two configuration keys read from an injected environment object and inlined into the delivered module']],
        },
        {
          fields: {
            item_class: 'admin-surface',
            location: 'src/components/admin-view.js',
            established_from: 'source',
            redaction_marker: 'not applicable; no value is involved',
            gating: 'client-only',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [['src/components/admin-view.js', 'a role comparison decides what is rendered; whether the service enforces it is not established here']],
        },
      ],
    },

    // Stage 9. Every risk names the records it rests on.
    risks: {
      completeness: 'Complete',
      lineage: [
        ['framework.frontend.routing', ['risk-0001']],
        ['framework.frontend.exposure', ['risk-0002']],
      ],
      records: [
        {
          fields: {
            risk: 'a registered staff route is reachable by address and by no navigation reference',
            cause: 'the route is registered and nothing in the client links to it',
            impact: 'the surface is discoverable by anyone who guesses the path, and its protection rests on a check the client performs',
            supporting_records: 'routing-0003, exposure-0002',
            likelihood_rationale: 'the path is a literal in a delivered module and is readable by any recipient of the client',
            next_verification: 'establish whether the service enforces staff access independently of the client',
          },
          unknown: 'the conclusion rests on routing-0003, and the routing artifact it derives from carries an Unknown record; artifact-level lineage cannot name the record actually relied upon, so STD-0007 R-28 makes this conclusion Unknown',
          evidence: [
            ['src/routes/routes.js', 'the route is registered and unreferenced'],
            ['src/components/admin-view.js', 'the guard is a rendering decision'],
          ],
        },
        {
          fields: {
            risk: 'configuration is inlined into a client with no build step, so authored source is delivered source',
            cause: 'the client is served as authored and its configuration module is fetched by the browser',
            impact: 'any key placed in that module is readable by every recipient, whether or not it is intended to be public',
            supporting_records: 'exposure-0001',
            likelihood_rationale: 'the delivery mechanism guarantees it rather than making it possible',
            next_verification: 'confirm that no key added to that module is ever a secret',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [['src/config/public-config.js', 'the module is loaded directly by the document']],
        },
      ],
    },

    // Stage 11. Every score shows its calculation and names the records beneath it.
    health: {
      completeness: 'Complete',
      lineage: [
        ['framework.frontend.routing', ['health-0001']],
        ['framework.frontend.components', ['health-0002']],
        ['framework.frontend.accessibility', ['health-0003']],
      ],
      records: [
        {
          fields: {
            dimension: 'routing-integrity',
            calculation: 'three of four routes carry an established reachability determination; one is unreferenced and one is unknown, so the dimension is adequate with a material gap',
            supporting_records: 'routing-0001, routing-0002, routing-0003, routing-0004',
          },
          unknown: 'one of the four routing determinations is itself Unknown, so no score for this dimension is supported; STD-0007 R-42 forbids an unexamined input contributing to a score at all',
          evidence: [['src/routes/routes.js', 'four route determinations, one unreferenced and one constructed']],
        },
        {
          fields: {
            dimension: 'component-cohesion',
            score: 2,
            calculation: 'every catalogued component has exactly one importer, so no component is reused and the dimension carries significant evidenced weakness',
            supporting_records: 'components-0001, components-0002, components-0003, components-0004',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [['src/components', 'four components, each imported once']],
        },
        {
          fields: {
            dimension: 'accessibility-evidence',
            calculation: 'one landmark observation, one control failing to expose a role or keyboard path, and one determination that could not be made; inspected only, with no automated evidence',
            supporting_records: 'accessibility-0001, accessibility-0002, accessibility-0003',
          },
          unknown: 'one of the three accessibility determinations is itself Unknown, so no score for this dimension is supported',
          evidence: [['src/components', 'markup inspected in full; no tooling output was supplied']],
        },
      ],
    },
  },
};
