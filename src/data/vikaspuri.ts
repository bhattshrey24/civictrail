/**
 * Curated, human-verified seed dataset — Vikaspuri (Assembly Constituency AC-31),
 * West Delhi.
 *
 * EVERY claim-bearing record cites a resolvable source and a verification date.
 * Facts are labelled verified / inferred / unverified and NEVER blurred. Where the
 * responsibility chain is incomplete (e.g. the ward councillor's name is not yet
 * verified against the Delhi State Election Commission record), it is left absent
 * on purpose — incomplete chains are valid (see CLAUDE.md).
 *
 * `verified_at` reflects the last human check during this build (2026-10-23).
 * Tender award details come from aggregators mirroring the official e-procurement
 * portal and are labelled accordingly; re-verify against the official portal
 * before treating award/contractor fields as final.
 */
import type { Dataset } from "@/lib/domain/schema";

const VERIFIED = "2026-10-23";

export const vikaspuri: Dataset = {
  locality: {
    id: "vikaspuri",
    name: "Vikaspuri (AC-31), West Delhi",
    ward_numbers: [111, 114],
    assembly_constituency: "Vikaspuri (AC-31)",
    parliamentary_constituency: "West Delhi",
    pincodes: ["110018", "110059"],
  },

  agencies: [
    {
      id: "mcd-west-zone",
      name: "Municipal Corporation of Delhi — West Zone",
      kind: "MCD",
      role: "Local/colony roads, local drains, dark-spot street lighting and sanitation within the MCD West Zone.",
      contact_url: "https://mcdonline.nic.in",
      escalation_url: "https://mcdonline.nic.in",
      confidence: "verified",
      evidence: [
        {
          source_url: "https://mcdonline.nic.in",
          verified_at: VERIFIED,
          is_official: true,
          excerpt: "Official MCD citizen services portal.",
        },
      ],
    },
    {
      id: "pwd-delhi",
      name: "Public Works Department, GNCTD",
      kind: "PWD",
      role: "Arterial and major roads and their street lighting across Delhi.",
      contact_url: "https://pwddelhi.gov.in",
      confidence: "verified",
      evidence: [
        {
          source_url: "https://pwddelhi.gov.in",
          verified_at: VERIFIED,
          is_official: true,
          excerpt: "Official PWD Delhi website.",
        },
      ],
    },
    {
      id: "djb",
      name: "Delhi Jal Board",
      kind: "DJB",
      role: "Water supply and sewerage (sewer) network.",
      contact_url: "https://delhijalboard.delhi.gov.in",
      confidence: "verified",
      evidence: [
        {
          source_url: "https://delhijalboard.delhi.gov.in/jalboard/about-us",
          source_date: "1998-04-06",
          verified_at: VERIFIED,
          is_official: true,
          excerpt:
            "DJB constituted in 1998 for water supply and sewage disposal.",
        },
      ],
    },
    {
      id: "ifc",
      name: "Irrigation & Flood Control Department, GNCTD",
      kind: "IFC",
      role: "Major storm-water drains and Yamuna embankments.",
      contact_url: "https://ifc.delhi.gov.in",
      confidence: "verified",
      evidence: [
        {
          source_url: "https://ifc.delhi.gov.in/ifc/functions-and-activities",
          verified_at: VERIFIED,
          is_official: true,
          excerpt:
            "I&FC maintains embankments and oversees major storm-water drains.",
        },
      ],
    },
  ],

  officials: [],

  representatives: [
    {
      id: "mla-vikaspuri-2025",
      type: "MLA",
      name: "Pankaj Kumar Singh",
      constituency: "Vikaspuri (AC-31)",
      party: "BJP",
      term_start: "2025-02-08",
      confidence: "verified",
      evidence: [
        {
          source_url:
            "https://en.wikipedia.org/wiki/Pankaj_Kumar_Singh_(politician)",
          source_date: "2025-02-08",
          verified_at: VERIFIED,
          excerpt:
            "Won Vikaspuri in the 2025 Delhi Assembly election, defeating Mahinder Yadav (AAP).",
        },
      ],
    },
    {
      id: "mla-vikaspuri-former",
      type: "MLA",
      name: "Mahinder Yadav",
      constituency: "Vikaspuri (AC-31)",
      party: "AAP",
      term_end: "2025-02-08",
      confidence: "verified",
      evidence: [
        {
          source_url:
            "https://en.wikipedia.org/wiki/Pankaj_Kumar_Singh_(politician)",
          verified_at: VERIFIED,
          excerpt:
            "Previous MLA for Vikaspuri (held the seat from 2014 until 2025). Included to show officeholder change over time.",
        },
      ],
    },
    {
      id: "mp-west-delhi-2024",
      type: "MP",
      name: "Kamaljeet Sehrawat",
      constituency: "West Delhi",
      party: "BJP",
      term_start: "2024-06-04",
      confidence: "verified",
      evidence: [
        {
          source_url:
            "https://en.wikipedia.org/wiki/West_Delhi_Lok_Sabha_constituency",
          source_date: "2024-06-04",
          verified_at: VERIFIED,
          excerpt:
            "Elected MP for West Delhi in the 2024 general election (Wikipedia citing ECI results).",
        },
      ],
    },
    // NOTE: the MCD ward councillor (AAP won Vikas Puri ward in Dec 2022) is
    // deliberately omitted — the individual's name is not yet verified against
    // the Delhi State Election Commission record. The chain stays incomplete
    // rather than carry an unverified name.
  ],

  assets: [
    {
      id: "dk-road",
      locality_id: "vikaspuri",
      type: "road",
      name: "D K Road (N G Road to A-1 DK Road), Ward 114",
      description: "Local road with associated RCC drainage, MCD West Zone.",
      owner_agency_id: "mcd-west-zone",
      confidence: "verified",
      evidence: [
        {
          source_url:
            "https://www.publicservicesmap.in/tenders/nit-no01--et-2026-mcd-273727-1",
          verified_at: VERIFIED,
          excerpt:
            "MCD tender for road and RCC-drain work on D K Road in Ward 114.",
        },
      ],
    },
    {
      id: "darkspots-ac31",
      locality_id: "vikaspuri",
      type: "streetlight",
      name: "Unlit 'dark spots' across AC-31 Vikaspuri",
      description:
        "Locations lacking street lighting, to be fitted with 5m GI poles + LED.",
      owner_agency_id: "mcd-west-zone",
      confidence: "verified",
      evidence: [
        {
          source_url:
            "https://www.publicservicesmap.in/tenders/providing-and-fixing-of-5m-gi-polygonal-poles-al--et-2026-mcd-275634-2",
          verified_at: VERIFIED,
          excerpt:
            "MCD (EE Electrical, West Zone) tender for GI poles + LED at dark spots in AC-31 Vikaspuri.",
        },
      ],
    },
    {
      id: "westzone-road-drain",
      locality_id: "vikaspuri",
      type: "drain",
      name: "Local road & drain works, Vikas Puri (West Zone)",
      description:
        "Road improvement and new drain construction listed for the West Zone around Vikas Puri.",
      owner_agency_id: "mcd-west-zone",
      confidence: "inferred",
      evidence: [
        {
          source_url:
            "https://www.tendershark.com/details/delhi-tender/municipal-corporation-of-delhi/793995bc-eb4b-47fb-9c0a-14b753da5ffb",
          verified_at: VERIFIED,
          excerpt:
            "MCD road development + drain construction listing (West Zone).",
        },
      ],
    },
  ],

  issues: [
    {
      id: "dk-road-reconstruction",
      asset_id: "dk-road",
      title: "Reconstruction of D K Road with new RCC drain (Ward 114)",
      description:
        "MCD West Zone road reconstruction (RMC) with RCC drain; scheduled for completion within 180 days of commencement.",
      status: "in_progress",
      confidence: "verified",
      evidence: [
        {
          source_url:
            "https://www.publicservicesmap.in/tenders/nit-no01--et-2026-mcd-273727-1",
          verified_at: VERIFIED,
          excerpt:
            "Tender value Rs 64,66,289; completion within 180 days of commencement.",
        },
      ],
      project: {
        id: "dk-road-reconstruction-project",
        tender_ref: "ET-2026-MCD-273727 (NIT No.01)",
        cost_inr: 6466289,
        progress_note:
          "Scheduled for completion within 180 days of commencement. Contractor/award not confirmed from available records.",
      },
      responsibilities: [
        {
          id: "dk-road-mcd-direct",
          party_type: "agency",
          party_id: "mcd-west-zone",
          basis: "direct",
          reasoning:
            "MCD West Zone (EE M-II) floated the tender and is the executing agency for this local road and drain.",
          confidence: "verified",
          evidence: [
            {
              source_url:
                "https://www.publicservicesmap.in/tenders/nit-no01--et-2026-mcd-273727-1",
              verified_at: VERIFIED,
              excerpt: "Tender issued by MCD West Zone.",
            },
          ],
        },
        {
          id: "dk-road-mla-political",
          party_type: "representative",
          party_id: "mla-vikaspuri-2025",
          basis: "political",
          reasoning:
            "Elected MLA for the constituency in which the road lies. This is a representative/political link only — the MLA has NO direct administrative control over an MCD tender. The connection is inferred from location, not from any documented decision by the MLA.",
          confidence: "inferred",
          evidence: [
            {
              source_url:
                "https://en.wikipedia.org/wiki/Pankaj_Kumar_Singh_(politician)",
              verified_at: VERIFIED,
              excerpt:
                "MLA for Vikaspuri (AC-31), the constituency of the road.",
            },
          ],
        },
      ],
    },
    {
      id: "darkspot-lighting",
      asset_id: "darkspots-ac31",
      title: "New LED street lights at dark spots across AC-31 Vikaspuri",
      description:
        "Provision and fixing of 5m GI polygonal poles with LED lights at various dark spots.",
      status: "pending",
      confidence: "verified",
      evidence: [
        {
          source_url:
            "https://www.publicservicesmap.in/tenders/providing-and-fixing-of-5m-gi-polygonal-poles-al--et-2026-mcd-275634-2",
          verified_at: VERIFIED,
          excerpt: "Tender value Rs 44,99,998; bid window closed 1 May 2026.",
        },
      ],
      project: {
        id: "darkspot-lighting-project",
        tender_ref: "ET-2026-MCD-275634 (NIT No.06)",
        cost_inr: 4499998,
        progress_note:
          "Bid window closed 1 May 2026; award status not confirmed from available records.",
      },
      responsibilities: [
        {
          id: "darkspot-mcd-direct",
          party_type: "agency",
          party_id: "mcd-west-zone",
          basis: "direct",
          reasoning:
            "EE (Electrical), MCD West Zone floated the tender for dark-spot street lighting.",
          confidence: "verified",
          evidence: [
            {
              source_url:
                "https://www.publicservicesmap.in/tenders/providing-and-fixing-of-5m-gi-polygonal-poles-al--et-2026-mcd-275634-2",
              verified_at: VERIFIED,
              excerpt: "Tender issued by MCD (EE Electrical), West Zone.",
            },
          ],
        },
      ],
    },
    {
      id: "vikaspuri-drain-blockage",
      asset_id: "westzone-road-drain",
      title: "Drainage/road works, Vikas Puri — responsibility not established",
      description:
        "A listed West Zone road+drain work. Whether a given blocked drain here is a local MCD drain, a DJB sewer line, or a larger I&FC storm-water drain cannot be established from available records.",
      status: "unclear",
      confidence: "inferred",
      evidence: [
        {
          source_url:
            "https://www.tendershark.com/details/delhi-tender/municipal-corporation-of-delhi/793995bc-eb4b-47fb-9c0a-14b753da5ffb",
          verified_at: VERIFIED,
          excerpt: "MCD West Zone road + drain listing.",
        },
      ],
      responsibilities: [
        {
          id: "drain-mcd-direct",
          party_type: "agency",
          party_id: "mcd-west-zone",
          basis: "direct",
          reasoning:
            "MCD West Zone is listed as the authority for this road + local drain work.",
          confidence: "inferred",
          evidence: [
            {
              source_url:
                "https://www.tendershark.com/details/delhi-tender/municipal-corporation-of-delhi/793995bc-eb4b-47fb-9c0a-14b753da5ffb",
              verified_at: VERIFIED,
              excerpt:
                "Listed under Municipal Corporation of Delhi (West Zone).",
            },
          ],
        },
        {
          id: "drain-ownership-unclear",
          party_type: "agency",
          party_id: "djb",
          basis: "unclear",
          reasoning:
            "If the blockage involves a sewer line rather than a surface drain, responsibility would sit with DJB, or with I&FC for a major storm-water drain. This is not established from available records.",
          confidence: "unverified",
          evidence: [],
        },
      ],
    },
  ],
};

export default vikaspuri;
