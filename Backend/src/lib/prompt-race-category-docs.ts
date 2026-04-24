const CATEGORY_DOCS = {
  "Drinks & Beverages": `Drinks & Beverages Scoring Methodology
Our beverage scoring system evaluates drinks based on ingredient safety, lab verification, and packaging considerations.

Scoring Components
Harmful Ingredients Assessment
Penalty Range: Up to 70 points total

Each harmful ingredient is evaluated using:

Severity score: 1-5 scale based on health impact
Amount vs. guidelines: Comparison to safety thresholds (logarithmic scaling)
Maximum total penalty: Capped at 70 points for all harmful ingredients combined
Contaminants vs. ingredients: Contaminants may receive different multipliers than intentional ingredients
Common Harmful Ingredients
Artificial sweeteners: Aspartame, sucralose, acesulfame potassium
Artificial colors: Red 40, Yellow 6, Blue 1
Preservatives: Sodium benzoate, potassium sorbate
Flavor enhancers: MSG, artificial flavors
Caffeine: When present in excessive amounts
Lab Verification Requirements
Penalty: 45 points if missing (20 points for certain categories)

Standard penalty: 45 points for products without verified lab reports
Reduced penalty: 20 points for categories weighted primarily on ingredients and packaging
Contaminated SKU penalty: 20 points if another SKU from the same brand has contaminants (indicates potential contamination risk)
Transparency requirement: All products should have verified lab reports
Accountability measure: Ensures ingredient accuracy
Consumer protection: Verified results preferred over claims
Packaging Impact Assessment
Penalty Range: Up to 20 points

Packaging materials are evaluated for potential chemical leaching and microplastic shedding:

Packaging Types
Glass: 0 points (best option, no leaching or microplastics)
Plastic: Variable penalty based on type:
PET/Polyester: 20 points (high nanoplastics + antimony leaching)
Polystyrene: 22 points (styrene leaching, worst for hot drinks)
Polypropylene (PP): 12 points (moderate microplastic shedding)
Polyethylene (PE): 12 points (moderate microplastic shedding)
Nylon: 12 points (sheds fibers, moderate concern)
PLA bioplastics: 8 points (less toxic than PET but still sheds microplastics)
Aluminum: 10 points (moderate penalty)
Cardboard with plastic liner: 10-15 points (depends on liner type)
Tetra Pak: Variable (depends on plastic content)
Special Considerations
Microplastic testing certification: Eliminates packaging penalty (0 points)
BPA-free certification: Reduces plastic penalty
Food-grade materials: Standard requirement
Category-Specific Adjustments
Plant-Based Milk Note
Plant-based milks (oat, almond, soy, coconut, etc.) have their own dedicated scoring methodology with a specialized 5-pillar framework covering contaminants, ingredients, pesticides, content %, and packaging. See the Plant-Based Milk Scoring page for details.

Organic Requirements
Certain beverage categories require organic certification:

Fruit juices: Organic penalty if not certified
Herbal teas: Pesticide residue considerations
Cap Material Assessment
Penalty Range: 0-7 points

Additional penalties for problematic cap materials:

Leaching caps: 7 points (painted metal, PVC components, or other concerning materials)
Safe caps: 0 points (food-grade materials, BPA-free, no leaching concerns)
Special consideration: If product is certified microplastic-free, cap material penalty is also eliminated.

Ingredient Evaluation Process
Beneficial Ingredients
While beneficial ingredients are tracked, they do not currently affect the score:

Vitamins and minerals: Nutritional additions
Antioxidants: Natural preservatives
Probiotics: Beneficial bacteria
Contaminant Detection
When contaminants are found in beverages:

Heavy metals: Lead, cadmium, arsenic
Pesticide residues: Agricultural chemical remnants
Microplastics: Plastic contamination
PFAS chemicals: Forever chemical presence
Special Scoring Considerations
Enhanced Safety for Consumables
Beverages receive enhanced scrutiny due to:

Direct consumption: No further processing
Regular intake: Daily consumption patterns
Vulnerable populations: Children and pregnant women
Certification Bonuses
Products with relevant certifications may receive score adjustments:

USDA Organic: Reduced penalty for organic categories
Non-GMO Project: Genetic modification considerations
Fair Trade: Ethical sourcing (informational only)
Score Interpretation
Score Ranges
90-100: Excellent safety profile with minimal concerns
80-89: Good safety with minor ingredient issues
70-79: Acceptable with some harmful ingredients
60-69: Concerning ingredients, consider alternatives
Below 60: Poor safety profile, avoid regular consumption
Health Considerations
Common Concerns
Artificial ingredients: Sweeteners, colors, and preservatives with potential health effects
Microplastics: Plastic particles from packaging leaching into beverages
Chemical leaching: BPA, phthalates, and other chemicals from plastic containers
Heavy metals: Lead, cadmium, arsenic from processing or packaging
Pesticide residues: Agricultural chemicals in fruit-based beverages
High sugar content: Excessive added sugars contribute to health issues
Caffeine: Excessive amounts can cause health concerns
Best Practices
Choose glass packaging when possible (safest option)
Look for products with verified lab reports
Select BPA-free and phthalate-free products
Prefer products certified microplastic-free
Read ingredient lists carefully
Avoid products with artificial colors and sweeteners when possible
Consider organic options for fruit juices and plant-based milks
Check for cap material safety (avoid painted metal or PVC caps)
Limit consumption of products with concerning ingredients
Choose products with transparency (published lab data)
Limitations
Scores reflect ingredient lists and available testing data
Natural doesn't always mean safer
Individual sensitivities may vary significantly
Regulatory approval doesn't guarantee safety
Product performance and taste are not evaluated
Environmental impact is not included in health scores

`,
  "Food Products": `Food Products Scoring Methodology
Enhanced Food Scoring
Food items receive doubled severity scores for harmful ingredients to account for food-specific health guidelines and enhanced safety requirements.

Scoring Framework
Food products are evaluated with enhanced scrutiny due to their direct consumption and potential for regular intake.

Enhanced Severity Multipliers
Food products use food-specific multipliers that differ from other categories:

Contaminants: Minimum 1.4x factor (baseline for contaminants)
Harmful ingredients: Minimum 3x factor (baseline for non-contaminants)
Logarithmic scaling: Penalties increase logarithmically based on amount over guidelines
Maximum factor: Up to 8x for contaminants, 5x for harmful ingredients
Under-guideline amounts: Reduced penalties but still penalized for presence
Scoring Components
Harmful Ingredients Assessment
Penalty Range: Up to 70 points total

Food ingredients are evaluated using food-specific guidelines when available:

Food-specific guidelines: Primary reference for safety limits (MADL - Maximum Allowable Dose Level)
Daily intake calculations: Per-serving vs daily limit comparisons
Logarithmic scaling: Penalties increase logarithmically based on amount over guidelines
Maximum total penalty: Capped at 70 points for all harmful ingredients combined
Contaminants vs. ingredients: Contaminants receive different multipliers (minimum 1.4x) than intentional ingredients (minimum 3x)
Common Harmful Ingredients in Food
Artificial preservatives: BHA, BHT, TBHQ
Artificial colors: Tartrazine, Allura Red, Brilliant Blue
Flavor enhancers: MSG, artificial flavors
Sweeteners: High fructose corn syrup, artificial sweeteners
Trans fats: Partially hydrogenated oils
Heavy metals: Lead, cadmium, arsenic (from processing/environment)
Lab Verification Requirements
Penalty: 45 points if missing (20 points for certain categories)

Standard penalty: 45 points for products without verified lab reports
Reduced penalty: 20 points for categories weighted primarily on ingredients and packaging
Contaminated SKU penalty: 20 points if another SKU from the same brand has contaminants
Ingredient verification: Testing confirms listed ingredients
Contaminant screening: Heavy metals, pesticides, additives
Transparency requirement: Published test results preferred
Packaging Assessment
Penalty Range: 0-20 points (up to 140 points for tea bags)

Food packaging is evaluated for safety and chemical migration:

Food-Safe Packaging Types
Glass: 0 points (safest option)
Food-grade plastic: Variable penalty based on type:
PET/Polyester: 15 points (higher microplastic shedding, especially with heat)
Polystyrene: 20 points (styrene exposure)
Polypropylene (PP): 10 points (moderate microplastic release)
Polyethylene (PE): 10 points (moderate microplastic release)
Nylon: 5 points (lower concern for food)
PLA bioplastics: 1 point (minimal concern)
Aluminum: 2-4 points (moderate penalty)
Paper/cardboard: 1-2 points (low penalty, depends on liners)
PE-lined paper: 12 points (high microplastic shedding with heat)
PLA-lined paper: 10 points (some microplastic release but lower than PE)
Special Packaging Considerations
Tea bags: 7x multiplier applied (packaging penalty × 7) due to direct contact with hot water and leaching concerns
Microplastic testing certification: Eliminates packaging penalty (0 points)
BPA-free certification: Reduces plastic penalties
Direct food contact: Enhanced scrutiny for inner packaging
Hot beverages: Higher penalties due to increased chemical migration at elevated temperatures
Category-Specific Requirements
Organic Certification Requirements
Certain food categories require organic certification to avoid penalties:

Categories Requiring Organic
Baby food: Enhanced safety for vulnerable populations
Tea products: Pesticide residue concerns
Produce-based items: Agricultural chemical exposure
Grains and cereals: Glyphosate and pesticide concerns
Organic Penalty
Non-organic penalty: Applied when category requires certification
Certification verification: Must be USDA Organic or equivalent
Penalty amount: Based on category risk assessment
Purity Testing
Penalty Range: 0-60 points

For products that claim specific ingredient purity (e.g., "100% organic", "pure honey"):

Purity tested: Penalty based on actual purity percentage
Formula: 60 × (1 - purity)
Example: 90% purity = 60 × 0.1 = 6 points penalty
Example: 50% purity = 60 × 0.5 = 30 points penalty
Purity not tested: 30 points penalty (if purity claim made but not verified)
No purity claim: 0 points (no penalty)
This ensures products making purity claims are held accountable for accuracy.

Special Food Considerations
Beneficial Ingredients Tracking
While beneficial ingredients don't affect scores, they are monitored:

Vitamins and minerals: Nutritional fortification
Probiotics: Beneficial bacteria
Antioxidants: Natural preservation and health benefits
Fiber: Digestive health components
Food-Specific Health Guidelines
Enhanced safety requirements for food products:

Daily intake limits: Per-serving calculations vs daily allowances
Vulnerable populations: Children, pregnant women considerations
Cumulative exposure: Multiple food source considerations
Contamination Sources
Food products are evaluated for various contamination pathways:

Agricultural residues: Pesticides, herbicides, fertilizers
Processing contaminants: Industrial chemicals, cleaning agents
Environmental contamination: Heavy metals, PFAS from soil/water
Packaging migration: Chemicals leaching from containers
Certification Bonuses and Penalties
Positive Certifications
USDA Organic: Meets organic category requirements
Non-GMO Project: Genetic modification considerations
Fair Trade: Ethical sourcing (informational)
Gluten-Free: Allergen considerations (when relevant)
Negative Indicators
Recalls: Historical safety issues
Lawsuits: Safety-related legal actions
Prop 65 warnings: California cancer/reproductive harm warnings
Score Interpretation
Food Safety Score Ranges
90-100: Excellent safety profile, minimal harmful ingredients
80-89: Good safety with minor concerns
70-79: Acceptable but some harmful ingredients present
60-69: Concerning ingredients, consider alternatives
Below 60: Poor safety profile, avoid regular consumption
Special Considerations for Food
Processing level: Highly processed foods face additional scrutiny
Ingredient complexity: More ingredients increase risk potential
Target demographics: Children's foods held to higher standards
Consumption frequency: Daily-use items evaluated more strictly
Health Considerations
Common Concerns
Artificial additives: Preservatives, colors, and flavor enhancers with potential health effects
Pesticide residues: Agricultural chemicals in produce-based foods
Heavy metals: Lead, cadmium, arsenic from processing or environmental contamination
Microplastics: Plastic particles from packaging leaching into food
Chemical leaching: BPA, phthalates, and other chemicals from plastic containers
Trans fats: Partially hydrogenated oils linked to cardiovascular disease
High processing: Ultra-processed foods may have unknown long-term effects
Purity claims: Products making purity claims must be verified
Best Practices
Choose organic options when available, especially for produce-based items
Prefer whole foods over highly processed options
Look for products with verified lab reports
Select products with full ingredient disclosure
Avoid products with artificial preservatives, colors, and flavors when possible
Choose glass packaging when available
Prefer products certified microplastic-free
Read purity claims carefully and verify they're tested
Check for tea bag material safety (avoid plastic tea bags)
Consider products with minimal packaging
Look for USDA Organic certification for categories requiring it
Limitations
Scores reflect ingredient lists and available testing data
Natural doesn't always mean safer
Individual sensitivities may vary significantly
Regulatory approval doesn't guarantee safety
Product taste and nutritional value are not evaluated
Environmental impact is not included in health scores
Long-term health effects of some ingredients are still being studied

`,
  "Eggs Scoring": `Eggs Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors related to hen welfare, feed quality, and contaminant exposure.

Evaluation Factors
Our eggs scoring system evaluates products based on the following criteria:

Living conditions - How hens are raised (pasture-raised to caged)
Feed quality - Type and quality of feed given to hens
Antibiotic use - Presence and frequency of antibiotic treatment
Pesticide exposure - Risk of pesticide residues in eggs
Contaminant testing - Third-party testing for contaminants
Additives - Artificial coloring or chemical treatments
Organic certification - USDA organic or equivalent certification
Packaging - Material safety and environmental considerations
Scoring Components
Living Conditions
Penalty Range: 0-30 points

The living conditions of egg-laying hens significantly impact egg quality and nutritional content:

Pasture-raised: 0 points (best - continuous outdoor access with low density)
Free-range: 8 points (good - daily outdoor access)
Cage-free: 16 points (moderate - indoor barn, no cages)
Caged: 30 points (worst - conventional battery cages)
Unknown: 15 points (default penalty if not specified)
Note: True pasture-raised eggs have higher omega-3 content, more vitamin E, and better overall nutrient profiles compared to caged eggs.

Feed Quality
Penalty Range: 0-40 points

The type of feed directly affects the nutritional value and potential contaminant load of eggs:

Pasture forage: 0 points (best - insects, greens, and natural diet results in ideal omega-3/omega-6 ratio)
Organic grain: 6 points (good - certified organic feed, no GMOs or synthetic pesticides)
Standard grain: 12 points (moderate - non-organic grain feed)
Corn/soy free: 15 points (feed without corn or soy - better omega profile than conventional)
Conventional corn/soy: 40 points (worst - commodity feed with GMO, pesticide residues, inflammatory omega-6 profile)
Unknown: 10 points (default penalty if not specified)
Important: Most "pasture-raised" brands still supplement with conventional corn/soy feed. True pasture-forage eggs are rare and command premium prices.

Antibiotic Use
Penalty Range: 0-12 points

Antibiotic use in poultry affects both egg safety and contributes to antibiotic resistance:

Never: 0 points (best - no antibiotics ever used)
Therapeutic only: 4 points (acceptable - antibiotics only when hens are sick)
Routine use: 12 points (worst - preventive/routine antibiotic use)
Unknown: 6 points (default penalty if not specified)
Pesticide Risk
Penalty Range: 0-12 points

Pesticide exposure comes primarily through contaminated feed:

Low: 0 points (organic or verified low-pesticide feed)
Medium: 6 points (standard grain feed)
High: 12 points (conventional commodity feed with known pesticide residues)
Unknown: 6 points (default penalty if not specified)
Contaminant Testing
Penalty Range: -6 to +5 points (can be bonus or penalty)

Third-party testing for contaminants provides transparency and safety assurance:

Full panel tested: -6 points (bonus - tested for heavy metals, PFAS, and mycotoxins)
Partial tested: 0 points (neutral - some testing performed)
Not tested: 5 points (penalty - no testing or unknown)
Unknown: 3 points (small penalty if testing status unknown)
Full panel testing should include:

Heavy metals (lead, arsenic, cadmium, mercury)
PFAS (forever chemicals)
Mycotoxins (from contaminated feed)
Dioxins and PCBs
Additives
Penalty Range: 0-8 points

Some egg producers use additives to enhance appearance or extend shelf life:

None: 0 points (best - no additives used)
Artificial yolk color: 8 points (uses marigold extract or synthetic colorants to enhance yolk color)
Chemical wash: 5 points (chemical washing of shells)
Note: Deep orange yolks from pasture-raised hens are natural; artificial colorants are used to mimic this in conventional eggs.

Organic Certification
Penalty: Variable points if not certified

Non-organic eggs receive a reduced organic penalty:

Organic certified: 0 points (no penalty)
Not organic: 60% of standard organic penalty
Organic certification ensures:

No synthetic pesticides in feed
No GMO ingredients
No routine antibiotics
Some outdoor access requirements
Packaging
Penalty Range: 0-15 points

Egg packaging materials are evaluated for environmental impact and potential contamination:

Cardboard/paper carton: Low penalty (most common, recyclable)
Plastic: Moderate penalty (microplastic concerns)
Styrofoam: Higher penalty (environmental and chemical concerns)
Certified Humane Bonus
Bonus: 5 points

Products with Certified Humane certification receive a 5-point bonus. This certification verifies:

Adequate living space
Access to fresh water and nutritious diet
Ability to engage in natural behaviors
Gentle handling to limit stress
Score Interpretation
Score Ranges
90-100: Excellent - Pasture-raised, organic, minimal concerns
80-89: Good - Free-range or high-quality cage-free with good practices
70-79: Fair - Cage-free with some quality concerns
60-69: Poor - Conventional eggs with significant issues
Below 60: Very Poor - Caged eggs with multiple concerns, avoid if possible
Health Considerations
Nutritional Differences
Eggs from well-raised hens can be significantly more nutritious. Compared to conventional eggs, pasture-raised eggs typically contain:

Vitamin A: 2x higher
Omega-3: 2-3x higher
Vitamin E: 3x higher
Beta-carotene: 7x higher
Omega-6:3 ratio: ~2:1 (ideal) vs ~20:1 (inflammatory in conventional)
Common Concerns
Salmonella: Higher risk in caged/crowded conditions
Pesticide residues: Accumulate in egg yolks from contaminated feed
Antibiotic resistance: Routine antibiotic use contributes to resistant bacteria
Heavy metals: Can accumulate in eggs from contaminated environments
PFAS: Forever chemicals detected in some egg supplies
Best Practices
Choose pasture-raised eggs when possible (verified by third-party certification)
Look for "Certified Humane" or "Animal Welfare Approved" labels
Prefer organic to reduce pesticide and antibiotic exposure
Check for brands that publish third-party testing results
Be skeptical of marketing terms without certification ("farm fresh", "natural")
Local eggs from known farms often exceed store-bought quality
Common Label Clarifications
Understanding egg labels can be confusing. Here's what each label means and how reliable it is:

Reliable Labels:

Pasture-Raised: Hens have outdoor access to pasture (Good reliability if certified)
Organic: USDA certified organic feed, no antibiotics (Good reliability)
Certified Humane: Third-party welfare verification (Good reliability)
Moderate Labels:

Free-Range: Some outdoor access (Moderate reliability - varies widely)
Omega-3 Enriched: Fed flax or fish oil (Moderate reliability - doesn't ensure welfare)
Unreliable Labels:

Cage-Free: Not in cages, but indoor only (Low reliability - still crowded)
Natural: No meaning for eggs (No reliability)
Farm Fresh: Marketing term only (No reliability)
Limitations
Scores reflect available information and certifications
Small local farms may have excellent practices but lack formal certification
Feed quality claims are often unverifiable
Seasonal variations in pasture access are not captured
Individual farm practices may vary within the same brand
Testing frequency and methodology varies by producer

`,
  "Milk Scoring": `Milk Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors related to animal welfare, feed quality, processing, and contaminant exposure.

Base Milk Ingredients
The base milk ingredient itself (raw milk, whole milk, cow milk, etc.) is not penalized as a harmful ingredient since it's the expected product. Only additives, contaminants, and processing factors affect the score.

Evaluation Factors
Our milk scoring system evaluates products based on the following criteria:

Living conditions - How cows are raised (pasture-raised to confined)
Feed quality - Type and quality of feed given to cows
Hormone use - Use of growth hormones (rBST/rBGH)
Antibiotic use - Presence and frequency of antibiotic treatment
Processing level - Raw, pasteurized, or ultra-processed
Pesticide exposure - Risk of pesticide residues
Additives - Synthetic vitamins, stabilizers, or thickeners
Organic certification - USDA organic or equivalent certification
Packaging - Material safety and leaching considerations
Scoring Components
Living Conditions
Penalty Range: 0-30 points

The living conditions of dairy cows significantly impact milk quality and nutritional content:

Pasture-raised: 0 points (best - continuous outdoor access with low density)
Free-range: 8 points (good - daily outdoor access)
Cage-free: 16 points (moderate - indoor barn, no confinement)
Caged/Confined: 30 points (worst - conventional confinement operations)
Unknown: 15 points (default penalty if not specified)
Note: Pasture-raised dairy cows produce milk with higher omega-3 content, more CLA (conjugated linoleic acid), and better overall nutrient profiles compared to confined cows.

Feed Quality
Penalty Range: 0-25 points

The type of feed directly affects the nutritional value and potential contaminant load of milk:

Pasture forage / Grass-fed: 0 points (best - 100% grass/pasture diet, zero grain supplementation)
Corn/soy free: 8 points (good - uses grain but verified NO corn or soy)
Majority pasture: 15 points (moderate - >50% grass but some corn/soy supplementation)
Conventional corn/soy: 25 points (worst - primarily grain-fed or >20% corn/soy)
Unknown: 18 points (default penalty if not specified)
Important: Most "grass-fed" brands still supplement with conventional grain. True 100% grass-fed/pasture-forage milk is rare and commands premium prices.

Hormone Use
Penalty Range: 0-10 points

Synthetic hormone use in dairy production affects milk quality and has potential health implications:

rBST-free / No added hormones: 0 points (best - no synthetic growth hormones)
Conventional: 10 points (worst - uses rBST/rBGH growth hormones)
Unknown: 5 points (default penalty if not specified)
Note: rBST (recombinant bovine somatotropin) increases milk production but is linked to higher IGF-1 levels in milk. Many countries have banned its use.

Antibiotic Use
Penalty Range: 0-12 points

Antibiotic use in dairy farming affects both milk safety and contributes to antibiotic resistance:

Never: 0 points (best - no antibiotics ever used)
Therapeutic only: 4 points (acceptable - antibiotics only when cows are sick)
Routine use: 12 points (worst - preventive/routine antibiotic use)
Unknown: 6 points (default penalty if not specified)
Processing Level
Penalty Range: 0-12 points

The level of processing affects nutrient preservation and enzyme activity:

Raw: 0 points only when raw_milk_microbial_evidence on the product is producer batch testing or third-party verified. If raw milk is flagged but we have no documented microbial screening, we apply the same penalty as pasteurized milk (5 points) until better sourcing exists. That default is intentional: unpasteurized milk is high-variance for safety, and we do not treat “unknown” as “low risk.” Additionally, if the product is not Oasis lab-tested (is_indexed) and microbial evidence is still unverified, we apply a separate raw milk uncertainty deduction so the overall score reflects safety we cannot verify from metadata alone.
Minimal: 2 points (light pasteurization, vat pasteurized)
Pasteurized: 5 points (standard pasteurization - 72°C for 15 seconds)
Ultra-pasteurized: 10 points (high heat - 138°C for 2 seconds, extended shelf life)
Ultra-filtered: 12 points (heavy processing - removes lactose and some nutrients)
Unknown: 5 points (default penalty if not specified)
Note: Heat treatment reduces the chance of illness from germs that can be present in milk. Raw milk may retain more native enzymes and heat-sensitive nutrients, but pathogens such as Listeria, E. coli, and Salmonella remain a real concern when milk is not pasteurized or when handling and testing are inadequate. Public health agencies generally advise infants, young children, people who are pregnant, adults aged 65 and older, and people with weakened immune systems to avoid raw milk. What is legal and how it is sold varies by jurisdiction; our score reflects product attributes we can model, not whether raw milk is lawful where you live.

Pesticide Risk
Penalty Range: 0-12 points

Pesticide exposure comes primarily through contaminated feed:

Low: 0 points (organic or verified low-pesticide feed)
Medium: 6 points (standard grain feed)
High: 12 points (conventional commodity feed with known pesticide residues)
Unknown: 6 points (default penalty if not specified)
Additives
Penalty Range: 0-10 points

Some milk products contain additives for fortification or stability:

None: 0 points (best - no additives)
Natural only: 2 points (natural vitamins like vitamin D3)
Synthetic: 10 points (synthetic vitamins, stabilizers, carrageenan, gums)
Unknown: 3 points (default penalty if not specified)
Milk Type
Penalty Range: 0-15 points

The type of milk affects its nutritional profile:

Whole milk: 0 points (best - full fat, minimally processed)
Reduced fat (2%): 3 points (some fat removal)
Low fat (1%): 5 points (significant fat removal)
Skim/Fat-free: 8 points (all fat removed - most processed)
Flavored: 15 points (chocolate, vanilla, etc. - added sugars and flavors)
Unknown: 0 points (no penalty if unknown, assume whole)
Organic Certification
Penalty: Variable based on quality indicators

Quality Indicator Reduction
Non-organic milk from high-quality farms can have its organic penalty fully waived based on quality indicators. Farms with excellent practices (pasture-raised, grass-fed, no hormones, no antibiotics, regenerative farming) often exceed organic certification standards.

For non-organic milk, the penalty is reduced based on quality indicators:

Quality Indicators (each reduces the non-organic penalty):

Pasture-raised: 25% reduction
Grass-fed: 20% reduction
Uses organic feed: 15% reduction
Regenerative farming: 10% reduction
No hormones: 10% reduction
No antibiotics: 10% reduction
Low pesticide risk: 5% reduction
Raw milk (only when microbial evidence is verified on the product): 10% reduction
Full Penalty Waiver Conditions:

Raw milk with verified microbial evidence and 4+ major quality indicators: 100% reduction (no penalty)
Products with 3+ major indicators and quality score ≥60: 100% reduction
Standard reduction: Proportional to quality score (up to 95%)
This ensures that high-quality non-certified farms aren't unfairly penalized when their practices exceed organic standards.

Packaging
Penalty Range: 0-15 points

Milk packaging materials are evaluated for potential chemical migration:

Glass bottle: 0 points (safest option, no leaching)
Cardboard/paper carton: 2-5 points (depends on inner lining)
HDPE plastic: 10 points (moderate microplastic concerns)
PET plastic: 12 points (higher microplastic shedding)
Polystyrene: 15 points (worst - styrene exposure concerns)
Note: Glass bottles are the safest option for milk storage, particularly for raw milk where the product is consumed without heat treatment.

Special Considerations
A2 Milk
Products containing only A2 beta-casein protein may be noted but do not receive scoring bonuses or penalties. A2 milk is easier to digest for some individuals but doesn't affect overall health score.

Protein Type (A2/A2)
While A2 protein is tracked as a certification, it doesn't directly affect the score since both A1 and A2 milk can be high-quality depending on farming practices.

Raw Milk Considerations
Raw milk is scored like other milk on farming and quality inputs, but microbial risk is not “free.” Without documented pathogen or microbial screening on the product, we do not assume raw is safer or cleaner than pasteurized for scoring purposes. When producers publish credible batch or third-party testing, we can reflect lower processing-related penalty and include raw in quality-indicator relief.

Why this matters: Outbreaks and serious illness linked to raw milk are well documented; risk depends on the herd, hygiene, cold chain, and testing—not on the word “natural.” If you choose raw milk, that is a personal decision; Oasis does not provide medical or legal advice. Check local laws and guidance from CDC / FDA / your state or national health authority if you are unsure.

Score Interpretation
Score Ranges
90-100: Excellent - Pasture-raised, grass-fed, raw or minimally processed, minimal concerns
80-89: Good - High-quality practices with minor processing or certification gaps
70-79: Fair - Conventional organic or good practices with some concerns
60-69: Poor - Conventional milk with significant processing or welfare concerns
Below 60: Very Poor - Highly processed milk with multiple concerns
Health Considerations
Nutritional Differences
Milk from well-raised cows can be significantly more nutritious. Compared to conventional milk, pasture-raised grass-fed milk typically contains:

Omega-3: 2-5x higher
CLA: 2-5x higher (anti-inflammatory)
Vitamin A: 2x higher
Vitamin E: 3x higher
Beta-carotene: 7x higher (visible as yellow tint)
Omega-6:3 ratio: ~2:1 (ideal) vs ~8:1 (inflammatory in conventional)
Raw Milk Benefits (when from quality sources)
Enzymes: Contains lactase, lipase, phosphatase
Beneficial bacteria: Natural probiotics
Proteins: Undenatured whey proteins
Vitamins: Heat-sensitive vitamins preserved (C, B12)
Common Concerns
Raw milk and pathogens: Unpasteurized milk can harbor bacteria and other germs that cause severe or life-threatening illness; vulnerable groups are often told to avoid it entirely.
Hormone residues: rBST increases IGF-1 levels in milk
Antibiotic residues: Can contribute to resistance and gut microbiome disruption
Pesticide residues: Accumulate in milk fat from contaminated feed
Mycotoxins: From moldy grain feed
Heavy metals: From contaminated soil/water
Microplastics: From plastic packaging, especially with temperature changes
Best Practices
Choose pasture-raised, grass-fed milk when possible
If you use raw milk, prioritize traceable sourcing, strict cold chain, and published testing; understand risks and restrictions where you live
Look for "rBST-free" or "no added hormones" labels
Select glass bottle packaging when available
Prefer organic to reduce pesticide and antibiotic exposure
Avoid ultra-pasteurized or ultra-filtered when fresh options are available
Check for farms that publish third-party testing results
Be skeptical of marketing terms without certification
Local milk from known farms often exceeds store-bought quality
Common Label Clarifications
Understanding milk labels can be confusing. Here's what each label means and how reliable it is:

Reliable Labels:

Pasture-Raised: Cows have outdoor access to pasture (Good reliability if certified)
Organic: USDA certified organic feed, no antibiotics, no hormones (Good reliability)
Grass-Fed: Diet primarily consisting of grass (Good reliability if certified)
Raw: Unpasteurized milk (Good reliability - regulated)
Moderate Labels:

rBST-Free: No synthetic growth hormones (Moderate reliability - hard to verify)
Hormone-Free: No added hormones (Moderate reliability)
A2: Contains only A2 beta-casein (Moderate reliability - requires testing)
Unreliable Labels:

Natural: No legal definition for milk (No reliability)
Farm Fresh: Marketing term only (No reliability)
Wholesome: Marketing term only (No reliability)
Limitations
Scores reflect available information and certifications
Small local farms may have excellent practices but lack formal certification
Feed quality claims are often unverifiable
Seasonal variations in pasture access are not captured
Individual farm practices may vary within the same brand
Testing frequency and methodology varies by producer
Raw milk legality and safety varies by jurisdiction`,
  "Plant-Based Milk Scoring": `Plant-Based Milk Scoring Methodology
Everything is scored out of 100 using our Universal Scoring Framework. This framework applies consistent evaluation pillars across all plant-based milk products—oat, almond, soy, coconut, rice, hemp, cashew, and more.

The "2% Almonds" Problem
Many plant-based milks contain shockingly low amounts of their primary ingredient—sometimes as little as 2% almonds or oats. Our Content % pillar directly exposes this, rewarding products with higher ingredient density and penalizing watered-down alternatives.

Universal Scoring Framework
Our plant-based milk scoring uses 5 universal pillars, each with specific maximum penalties:

Contaminants (-35 max): Heavy metals (Lead, Arsenic, Cadmium, Chromium)
Ingredients (-25 max): Additives, seed oils, gums, sweeteners
Pesticide/Glyphosate (-15 max): Residue levels, organic status
Content % (-15 max): Actual primary ingredient density
Packaging (-10 max): BPA, phthalates, microplastic risk
Total possible penalty: -100 points

1. Contaminants (-35 max)
Heavy metal contamination is evaluated with specific thresholds for each metal:

Lead
Penalty Range: 0-12 points

Safe (less than 1 ppb): 0 points
Moderate (1-5 ppb): -3 points
High (5-15 ppb): -8 points
Severe (greater than 15 ppb): -12 points
Arsenic
Penalty Range: 0-9 points

Safe (less than 3 ppb): 0 points
Moderate (3-10 ppb): -4 points
High (greater than 10 ppb): -9 points
Cadmium
Penalty Range: 0-7 points

Safe (less than 1 ppb): 0 points
Moderate (1-5 ppb): -3 points
High (greater than 5 ppb): -7 points
Chromium
Penalty Range: 0-7 points

Safe (less than 50 ppb): 0 points
Elevated (greater than 50 ppb): -7 points
Category Adjustments
Rice milk receives 1.5x weight on arsenic penalties due to rice's known arsenic absorption from soil.
Baby products receive 2x weight across all heavy metals due to heightened vulnerability.

2. Ingredients (-25 max)
Additives commonly found in plant-based milks are evaluated for health impact:

High-Concern Ingredients
Carrageenan: -8 points (inflammatory, gut irritant)
Seed oils (canola, sunflower, rapeseed): -6 points (inflammatory omega-6, oxidation concerns)
Artificial sweeteners (sucralose, aspartame, etc.): -5 points (gut microbiome disruption)
Moderate-Concern Ingredients
Gums (gellan, xanthan, guar, locust bean): -3 points each (max 2 gums penalized, cap: -6)
Natural flavors (undisclosed): -3 points (lack of transparency)
Added sugars: -2 to -5 points (varies by type: cane sugar vs. HFCS)
Gum Penalty Cap
Many plant milks use multiple gums for texture. We cap gum penalties at 2 types (-6 max) to avoid over-penalizing products that use several gums in small amounts.

3. Pesticide / Glyphosate (-15 max)
Pesticide exposure is evaluated based on organic certification and testing:

Certified organic: 0 points (no synthetic pesticides allowed)
Non-organic, non-detectable residue: -3 points (tested, no residues found)
Non-organic, less than 20 ppb glyphosate: -7 points (low residue detected)
Non-organic, 20-100 ppb glyphosate: -12 points (moderate residue)
Non-organic, greater than 100 ppb glyphosate: -15 points (high residue)
High-Risk vs. Low-Risk Crops
High-Risk Crops
Oats (commonly sprayed with glyphosate as desiccant)
Soy (often GMO, heavy pesticide use)
Wheat
Corn
Lower-Risk Crops
Coconut
Hemp
Almond
Cashew
Macadamia
Note: Oat milk and soy milk without organic certification are tested by default as high-risk crops.

4. Content % (-15 max)
This pillar measures how much of the "hero ingredient" is actually in the product—exposing the widespread practice of selling mostly water with minimal actual almonds, oats, or other base ingredients.

Greater than 15%: 0 points (excellent ingredient density)
10-15%: -3 points (good density)
5-10%: -7 points (moderate—typical for many brands)
2-5%: -12 points (low—mostly water and additives)
Less than 2%: -15 points (very low—the "2% almonds" scam)
Why Content % Matters
A typical almond milk contains only 2-3% almonds. Premium brands may contain 7-15%. This pillar rewards brands that deliver actual nutritional value rather than flavored water with thickeners.

Product Variant Adjustments
Unsweetened Original: Often has higher base ingredient content
Flavored varieties (vanilla, chocolate): Typically lower content due to added sugars and flavors
5. Packaging (-10 max)
Packaging materials are evaluated for chemical migration and microplastic risk:

Glass bottle: 0 points (safest option)
BPA-free certified carton: 0 points (verified safe lining)
Tetra Pak / Standard carton: -3 points (usually lined, transparency varies)
HDPE plastic bottle: -3 points (moderate microplastic concern)
PET plastic bottle: -4 points (higher microplastic shedding)
BPA-lined can: -5 points (BPA exposure concern)
No packaging transparency: -3 points (additional penalty for lack of info)
Canned Coconut Milk Alert
Canned coconut milk is flagged by default for BPA verification. Products without BPA-free certification receive the full can penalty. Look for brands that explicitly state "BPA-free lining."

Microplastics Testing
Products that have undergone third-party microplastics testing receive a -2 reduction in packaging penalty.

Score Interpretation
Score Ranges
90-100: Excellent - High content %, organic, no concerning additives
80-89: Good - Quality product with minor concerns
70-79: Fair - Moderate additives or missing certifications
60-69: Poor - Low content %, multiple additives, non-organic
Below 60: Very Poor - Multiple red flags across pillars
Comparison by Plant Milk Type
Different plant milks have inherent strengths and concerns:

Oat Milk: Creamy texture, fiber | Concerns: Glyphosate exposure, seed oils, gums
Almond Milk: Low calorie | Concerns: Very low almond content (often 2%)
Soy Milk: High protein | Concerns: GMO/pesticides, phytoestrogens controversy
Coconut Milk: Rich flavor, MCTs | Concerns: BPA in cans, gums, low protein
Rice Milk: Allergy-friendly | Concerns: Arsenic risk, high glycemic
Hemp Milk: Complete protein, omega-3 | Concerns: Less available, taste preference
Pea Milk: High protein | Concerns: Gums, processing concerns
Cashew Milk: Creamy, versatile | Concerns: Low cashew content
What to Look For
Green Flags
Organic certification (USDA Organic or equivalent)
Glyphosate Residue Free certification
High primary ingredient % (greater than 10%)
Glass packaging or BPA-free certified
Minimal ingredients (3-5 ingredients)
No carrageenan
No seed oils
Red Flags
Carrageenan (inflammatory)
Multiple gums (gellan + xanthan + guar)
Seed oils (canola, sunflower, rapeseed)
"Natural flavors" without disclosure
Artificial sweeteners
No organic certification (especially oat/soy)
Canned without BPA-free label (coconut milk)
No content % listed
Common Label Clarifications
Reliable Labels
USDA Organic: Strict pesticide/GMO standards (High reliability)
Glyphosate Residue Free: Third-party tested (High reliability)
Non-GMO Project Verified: No GMO ingredients (Moderate reliability)
BPA-Free: No bisphenol-A in packaging (Moderate reliability)
Less Reliable Labels
"Natural": No legal definition (Low reliability)
"Plant-powered": Marketing term (No reliability)
"Clean ingredients": Marketing term (No reliability)
"Simple": Subjective claim (No reliability)
Limitations
Content % is not always disclosed on packaging and may be estimated
Contaminant testing data is limited for many brands
Glyphosate testing varies in methodology and detection limits
Small-batch or local brands may lack formal certifications despite good practices
Reformulations may not be immediately reflected in scores

`,
  "Bread Products": `Bread Products Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Bread products are evaluated with particular attention to glyphosate contamination from wheat desiccation, dough conditioners banned in other countries, and ultra-processing indicators.

Subcategory Adjustments
Buns: Sugar pillar 1.3x (often sweeter than standard bread)
Bagels: Flour quality 1.2x (chewy texture often from additive dough conditioners)
Tortilla wraps: Oil quality 1.3x (often high in seed oils)
Evaluation Factors
Glyphosate & pesticide risk - Wheat source, organic status, grain type
Flour quality - Flour type and critical dough conditioners (bromate, ADA)
Additives & preservatives - Artificial colors, flavors, and preservatives
Sugar & sweeteners - Sugar type and content per slice
Oil quality - Type of fats and oils used
Ingredient simplicity - Processing level indicator
Packaging - Material safety
Ingredient severity - Per-ingredient safety analysis
Scoring Components
Glyphosate & Pesticide Risk
Penalty Range: 0-30 points

The primary differentiator for bread safety. Wheat desiccation (spraying glyphosate before harvest) is a major contamination source:

Wheat Source
USDA Organic: 0 points (no glyphosate permitted)
Glyphosate Residue Free Certified: 3 points
Glyphosate-free (unverified): 10 points
Non-GMO conventional: 15 points
Conventional: 20 points (highest desiccation risk)
Organic Status
USDA Organic: 0 points
Made with organic: 5 points
Conventional: 10 points
High-Risk Grains
Conventional wheat/oats: 5 additional points
Conventional corn: 3 additional points
Conventional ancient grains: 3 additional points
Flour Quality
Penalty Range: 0-25 points

Flour Type
Whole wheat / sprouted / ancient grain: 0 points
Unbleached all-purpose: 5 points
Enriched: 10 points (nutrients stripped then partially added back)
Bleached: 15 points (chemical bleaching agents)
Critical Dough Conditioners
Potassium bromate: 25 points (classified as possibly carcinogenic, banned in EU, UK, Canada)
Azodicarbonamide (ADA): 20 points (banned in EU/Australia, creates semicarbazide when baked)
DATEM: 8 points
Mono/diglycerides: 8 points
L-cysteine: 8 points (often derived from human hair or duck feathers)
Sodium stearoyl lactylate: 5 points
Additives & Preservatives
Penalty Range: 0-20 points

Artificial colors: 15 points
Artificial flavors: 12 points
Caramel color: 10 points (potential 4-MEI formation)
Calcium propionate: 8 points
Sodium benzoate: 8 points
Sorbic acid: 5 points
Natural flavors: 4 points
Sugar & Sweeteners
Penalty Range: 0-15 points

Sugar Type
No added sugar: 0 points
Honey/molasses: 2 points
Sugar present (not top 5 ingredient): 4 points
Sugar in top 5 ingredients: 8 points
Corn syrup: 12 points
High fructose corn syrup: 15 points
Sugar Content Per Slice
< 2g: 0 points
2-4g: 4 points
> 4g: 8 additional points
Oil Quality
Penalty Range: 0-15 points

No added oil / olive oil: 0 points
Butter: 2 points
Palm oil / sunflower oil: 8 points
Canola oil: 10 points
Soybean oil / vegetable oil / cottonseed oil: 12 points
Ingredient Simplicity
Penalty Range: 0-10 points

Ingredient count serves as a proxy for ultra-processing:

< 5 ingredients: 0 points (ideal — flour, water, salt, yeast)
5-9 ingredients: 2 points
10-14 ingredients: 4 points
15-19 ingredients: 7 points
20+ ingredients: 10 points (ultra-processed)
Unrecognizable chemicals present: +5 additional points
Packaging
Penalty Range: 0-10 points

Paper bag / bakery (no packaging): 0 points
Plastic bag: 5 points
Unknown: 3 points
Ingredient Severity
Penalty Range: 0-30 points

All ingredients are individually analyzed using food-grade safety calculations with severity scores and guideline comparisons.

Score Interpretation
Score Ranges
90-100: Excellent - Organic, simple ingredients, no concerning additives
80-89: Good - Minimal processing, few additives
70-79: Fair - Some preservatives or non-organic ingredients
60-69: Poor - Significant additives, non-organic, seed oils
Below 60: Very Poor - Ultra-processed with multiple concerning ingredients
Health Considerations
Common Concerns
Glyphosate residues: Found in most conventional wheat products from pre-harvest spraying
Potassium bromate: Classified as possibly carcinogenic by IARC, banned in many countries but still allowed in the US
Azodicarbonamide (ADA): Banned in EU and Australia; breaks down into semicarbazide during baking
Seed oils: Soybean, canola, and vegetable oils are highly processed and inflammatory
High fructose corn syrup: Associated with metabolic issues
Ultra-processing: Products with 20+ ingredients are often heavily processed
Best Practices
Choose organic bread to avoid glyphosate residues
Look for sprouted or whole grain options
Avoid products containing potassium bromate or ADA
Prefer bread with 5 or fewer recognizable ingredients
Select products without seed oils (olive oil or butter preferred)
Check sugar content — good bread needs minimal sweetener
Support local bakeries with transparent ingredient lists
Prefer sourdough (natural fermentation, often simpler ingredients)
Limitations
Scores reflect available ingredient lists and certifications
Glyphosate testing is not always publicly available
Local bakery products may lack formal certification but have excellent practices
Sourdough fermentation benefits are noted but not directly scored
Seasonal grain quality variations are not captured

`,
  "Dairy Products": `Dairy Products Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors related to animal welfare, feed quality, processing level, and chemical exposure.

Specialized Routing
Eggs and milk have their own dedicated scoring methodologies. This methodology covers other dairy products including cheese, butter, yogurt, cream, kefir, ghee, and ice cream.

Evaluation Factors
Our dairy scoring system evaluates products based on the following criteria:

Living conditions - How animals are raised (pasture-raised to caged)
Feed quality - Type and quality of feed given to animals
Antibiotic use - Presence and frequency of antibiotic treatment
Hormone use - rBST/rBGH hormone administration
Processing level - Degree of processing and pasteurization
Pesticide exposure - Risk of pesticide residues
Additives - Artificial or synthetic additives
Harmful ingredients - Individual ingredient safety analysis
Packaging - Material safety and leaching concerns
Certifications - Organic, grass-fed, and other certifications
Scoring Components
Living Conditions
Penalty Range: 0-30 points

Animal living conditions significantly impact dairy quality:

Pasture-raised: 0 points (continuous outdoor access, low density)
Free-range: 8 points (daily outdoor access)
Cage-free: 16 points (indoor barn, no cages)
Caged: 30 points (conventional confinement)
Unknown: 15 points
Feed Quality
Penalty Range: 0-25 points

Feed directly affects nutrient profiles and contaminant loads:

Pasture forage: 0 points (100% grass/pasture, zero grain)
Corn/soy free: 8 points (grain-fed but no corn or soy)
Majority pasture: 15 points (>50% grass with some corn/soy)
Conventional corn/soy: 25 points (primarily grain-fed with GMO and pesticide concerns)
Unknown: 18 points
Antibiotic Use
Penalty Range: 0-12 points

Never: 0 points
Therapeutic only: 4 points (only when animals are sick)
Routine use: 12 points (preventive/routine use contributes to resistance)
Unknown: 6 points
Hormone Use
Penalty Range: 0-10 points

rBST-free / no added hormones: 0 points
Conventional (may use hormones): 10 points
Unknown: 5 points
Processing Level
Penalty Range: 0-15 points

Raw: 0 points (unpasteurized, maximum enzymes and beneficial bacteria)
Minimal processing: 2 points
Standard pasteurization: 5 points
Ultra-pasteurized: 10 points (high heat destroys beneficial bacteria)
Ultra-filtered: 12 points (heavy processing)
Heavily processed: 15 points
Unknown: 5 points
Pesticide Risk
Penalty Range: 0-12 points

Low (organic or tested): 0 points
Medium (standard grain feed): 6 points
High (conventional commodity feed): 12 points
Unknown: 6 points
Additives
Penalty Range: 0-10 points

None: 0 points
Natural only (cultures, enzymes): 2 points
Synthetic additives: 10 points
Unknown: 3 points
Ingredient Bonuses (Max +10)
Beneficial ingredients in dairy products are rewarded:

Raw milk enzymes: Bonus points for preserved beneficial enzymes
Probiotics: Live beneficial bacteria cultures
Natural omega-3s: From grass-fed sources
Score Interpretation
Score Ranges
90-100: Excellent - Pasture-raised, organic, minimal processing
80-89: Good - Free-range or high-quality with good practices
70-79: Fair - Cage-free or conventional with some quality features
60-69: Poor - Conventional with significant issues
Below 60: Very Poor - Heavily processed with multiple concerns
Health Considerations
Nutritional Differences
Dairy from well-raised animals can be significantly more nutritious:

Omega-3 content: 2-5x higher in grass-fed dairy
CLA (Conjugated Linoleic Acid): Higher in grass-fed products
Vitamin K2: Present in grass-fed butter and cheese
Beta-carotene: Higher in pasture-raised dairy (visible in yellow butter color)
Beneficial bacteria: Present in raw and minimally processed dairy
Common Concerns
rBST/rBGH hormones: Banned in EU, Canada, and other countries but allowed in US
Antibiotic residues: Can contribute to antibiotic resistance
Pesticide residues: Accumulate in dairy fat from contaminated feed
Ultra-pasteurization: Destroys beneficial enzymes and bacteria
Additives: Artificial thickeners, preservatives, and flavors in processed dairy
Packaging leaching: Plastic containers may leach chemicals into fatty dairy products
Best Practices
Choose pasture-raised or grass-fed dairy when possible
Prefer organic to reduce pesticide and antibiotic exposure
Select minimally processed products (avoid ultra-pasteurized when possible)
Look for products with live cultures (yogurt, kefir)
Choose glass packaging for fatty dairy products (butter, cream)
Read ingredient lists — quality dairy needs minimal additives
Look for grass-fed certifications (AGA, PCO)
Consider raw dairy from trusted local sources where legal
Limitations
Scores reflect available information and certifications
Small local farms may have excellent practices but lack certification
Seasonal variations in pasture access affect nutritional content
Processing claims (like "grass-fed") can vary in meaning
Individual lactose tolerance and dairy sensitivities vary
Cheese aging and fermentation benefits are not fully captured

`,
  "Fast Food": `Fast Food Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Fast food products are evaluated with attention to cooking oils, processing level, ingredient transparency, and the unique challenges of restaurant food preparation.

Evaluation Factors
Our fast food scoring system evaluates products based on the following criteria:

Harmful ingredients - Per-ingredient safety analysis
Cooking oils - Types of oils used for cooking and frying
Processing level - Use of processed meats, artificial additives, and preservatives
Ingredient transparency - Whether the restaurant publishes ingredient information
Packaging - Takeout packaging materials and chemical exposure
Sourcing quality - Use of organic, grass-fed, or fresh ingredients
Scoring Components
Harmful Ingredients Assessment
Penalty Range: Up to maximum cap

All identified ingredients are individually analyzed using food-grade safety calculations with severity scores and guideline comparisons.

Cooking Oils
Penalty Range: 0-35+ points

Cooking oils are a major health factor in fast food:

Seed Oil Penalty
Seed oils detected: 25 points (canola, soybean, corn, vegetable, sunflower, safflower, cottonseed, peanut)
No seed oils + uses healthy oils: -12 points (bonus for using olive oil, avocado oil, coconut oil, tallow, butter, or ghee)
Frying Practices
Deep frying: 10 additional points
Oil reuse: 8 additional points (chains that extensively reuse frying oil)
Processing Level
Penalty Range: 0-30+ points

Processed meat used: 12 points (heavily processed meats like nuggets, patties)
Artificial additives: 8 points (artificial colors, flavors)
Preservatives used: 6 points
MSG or hydrolyzed proteins: 4 points
Sourcing Quality Bonuses
Restaurants using higher-quality ingredients receive score bonuses:

Organic ingredients: +10 points
Grass-fed meat: +8 points
Fresh ingredients: +5 points
Local produce: +3 points
Ingredient Transparency
Penalty Range: 0-20 points

Publishes full ingredients + nutrition info + allergen info: 0 points (with bonuses: -3 for nutrition, -2 for allergens)
Does not publish ingredients: 20 points (major transparency concern)
Packaging Assessment
Takeout packaging is evaluated for chemical exposure:

Standard food-grade packaging penalties apply
Styrofoam/polystyrene containers: +10 additional points (styrene exposure with hot food)
Aluminum foil/containers: +10 additional points (aluminum leaching with acidic foods)
Pesticide Risk
High-pesticide items that aren't organic: Additional penalty (50% of standard organic penalty)
Score Interpretation
Score Ranges
90-100: Excellent - Clean ingredients, healthy oils, full transparency
80-89: Good - Mostly clean with minor concerns
70-79: Fair - Some seed oils or processed ingredients
60-69: Poor - Significant seed oil use, processed ingredients
Below 60: Very Poor - Multiple concerns (seed oils, processed meat, no transparency)
Health Considerations
Common Concerns
Seed oils: Highly processed, inflammatory omega-6 fatty acids used in most fast food chains
Oil reuse: Repeated heating of oils creates harmful compounds (acrolein, trans fats)
Processed meats: WHO classifies processed meat as Group 1 carcinogen
MSG and hydrolyzed proteins: May cause adverse reactions in sensitive individuals
Hidden ingredients: Many fast food items contain undisclosed additives
Styrofoam packaging: Styrene can leach into hot foods
Sodium levels: Most fast food items contain excessive sodium
Best Practices
Choose restaurants that publish their full ingredient lists
Ask about cooking oils — prefer restaurants using olive oil, avocado oil, or butter
Avoid deep-fried items when possible
Look for restaurants using grass-fed meat and fresh ingredients
Choose grilled or baked options over fried
Avoid styrofoam containers — ask for paper or cardboard
Check for restaurants with organic sourcing commitments
Consider bringing your own container for takeout
Limitations
Scores reflect available ingredient information (many restaurants don't disclose)
Cooking practices may vary between locations of the same chain
Oil quality and reuse frequency are not always verifiable
Seasonal menu items may not be scored
Individual franchise locations may differ from corporate standards
Cross-contamination between cooking methods is not captured

`,
  Produce: `Produce Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Produce scoring focuses on pesticide exposure, post-harvest treatments, sourcing transparency, and packaging — with an additional pillar for prepared/pre-cut produce.

Evaluation Factors
Our produce scoring system evaluates products based on the following criteria:

Pesticide risk - Organic status, Dirty Dozen / Clean Fifteen classification, GMO, glyphosate exposure
Treatments & freshness - All post-harvest treatments (wax, ripening agents, storage tech, chemical sprays) and supply-chain freshness
Sourcing - Origin transparency and import fumigation
Packaging - Packaging material contact and environmental concerns
Prepared produce - Sanitizer washes, pre-cut processing (when applicable)
Scoring Components
Pesticide Risk
Penalty Range: 0-40 points

This is the primary differentiator for produce safety:

Organic Status
USDA Organic: 0 points (no synthetic pesticides)
Transitional organic: 5 points
Conventional: Variable based on risk tier
Pesticide Risk Tiers
High (Dirty Dozen, conventional): 25 points (highest pesticide residues — strawberries, spinach, kale, etc.)
Medium (conventional): 15 points
Low (Clean Fifteen, conventional): 5 points (lowest residues — avocados, sweet corn, pineapple, etc.)
None (organic / no pesticide risk): 0 points
GMO Penalty
GMO detected (conventional, not Non-GMO verified): 8 additional points
Glyphosate Risk
High (Roundup Ready GMO crops, desiccant use): 10 points
Moderate (conventional crops with known residue detections): 5 points
Low (crops rarely exposed): 2 points
None (organic): 0 points
Unknown: 3 points
Treatments & Freshness
Penalty Range: 0-25 points

This pillar evaluates all post-harvest treatments applied to the produce and how long it typically sits in the supply chain. Each treatment in the list adds its own penalty, and they are summed together.

Treatment Penalties
Ethylene ripened: 5 points — Force-ripening with ethylene gas (bananas, tomatoes, avocados)
1-MCP / SmartFresh: 5 points — Synthetic ripening inhibitor for long-term storage (apples, pears)
Controlled atmosphere: 4 points — Modified atmosphere long-term storage
DPA antioxidant: 7 points — Diphenylamine scald prevention — banned in EU (apples)
Wax (petroleum): 8 points — Synthetic petroleum-based coating
Wax (shellac): 4 points — Insect-derived lac resin coating
Wax (carnauba): 2 points — Natural plant wax
Wax (beeswax): 2 points — Natural animal wax
Irradiated: 6 points — Radiation treatment for pest/pathogen control
Chlorine wash: 7 points — Chlorinated water wash
Fungicide spray: 9 points — Post-harvest fungicide (thiabendazole, imazalil, fludioxonil, etc.)
Freshness Risk Tier
Fresh (days to low weeks — local, in-season): 0 points
Moderate storage (weeks to 1-2 months — imported, off-season): 3 points
Extended storage (months to 12+ months — CA storage apples, pears, kiwis): 6 points
Unknown: 2 points
Sourcing
Penalty Range: 0-15 points

Origin listed, no concerns: 0 points
Origin unlisted: 8 points (transparency issue)
High-risk origin: 10 points (countries with weaker pesticide regulations)
Import Fumigation
None: 0 points
Phosphine: 7 points
Methyl bromide: 10 points (ozone depleting, neurotoxic)
Unknown: 3 points
Packaging
Penalty Range: 0-10 points

Loose (no packaging) / paper bag: 0 points
Cardboard: 1 point
Mesh bag: 2 points
Plastic bag / plastic wrap: 4 points
Plastic clamshell: 5 points
Styrofoam tray: 7 points
Prepared Produce (Only If Applicable)
Penalty Range: 0-15 points

Pre-cut, bagged, and washed produce receives additional evaluation:

Sanitizer Wash
Water only / none: 0 points
Peroxyacetic acid: 5 points
Chlorine wash: 8 points
Unknown: 3 points
Additional Concerns
Pre-cut/bagged (extended plastic contact): 5 points
Preservatives added: 5 points
Certifications & Quality
Penalty Range: 0-15 points

Items lacking quality certifications and sourcing transparency are penalized:

Not USDA Organic or Regenerative Organic: 8 points
Not locally sourced: 3 points
Farm not identified (no traceability): 3 points
No wax-free certification: 2 points
Score Interpretation
Score Ranges
90-100: Excellent - Organic, minimal treatments, transparent sourcing
80-89: Good - Organic or Clean Fifteen, few concerns
70-79: Fair - Conventional with moderate pesticide risk
60-69: Poor - Dirty Dozen without organic certification
Below 60: Very Poor - Multiple concerns (high pesticides, wax, fumigation)
Health Considerations
The Dirty Dozen (Highest Pesticide Residues)
According to EWG's annual Shopper's Guide, these items consistently test highest:

Strawberries
Spinach
Kale/Collard/Mustard Greens
Peaches
Pears
Nectarines
Apples
Grapes
Bell/Hot Peppers
Cherries
Blueberries
Green Beans
Recommendation: Buy these organic whenever possible.

The Clean Fifteen (Lowest Pesticide Residues)
These items typically have the least pesticide contamination:

Avocados
Sweet Corn
Pineapple
Onions
Papaya
Sweet Peas (frozen)
Asparagus
Honeydew Melon
Kiwi
Cabbage
Mushrooms
Mangoes
Sweet Potatoes
Watermelon
Carrots
Note: Conventional options for these are generally acceptable.

Common Concerns
Glyphosate: Widely used herbicide found on many conventional crops — scored as its own risk factor
Organophosphates: Neurotoxic insecticides
1-MCP (SmartFresh): Synthetic ripening inhibitor that allows apples/pears to be stored for 12+ months
DPA (Diphenylamine): Antioxidant scald preventant applied to apples — banned in EU since 2012
Petroleum wax: Synthetic coatings applied to extend shelf life
Post-harvest fungicides: Thiabendazole, imazalil, fludioxonil applied to citrus, stone fruit, and more
Methyl bromide fumigation: Used on imported produce, neurotoxic
Pre-washed salads: May contain chlorine wash residues and extended plastic contact
Best Practices
Buy organic for Dirty Dozen items
Conventional is acceptable for Clean Fifteen
Wash all produce thoroughly (even organic)
Choose local and seasonal when possible
Avoid pre-cut produce in plastic containers when fresh options are available
Look for Regenerative Organic certification for the highest standard
Peel conventionally grown produce when possible (removes surface residues)
Buy from farmers markets where you can ask about growing practices
Limitations
Scores reflect available certification and sourcing data
Actual pesticide residue levels vary by batch, region, and season
The Dirty Dozen / Clean Fifteen lists are updated annually
Washing reduces but doesn't eliminate all pesticide residues
Local/small farm produce may lack certification but have excellent practices
Nutritional content and taste are not evaluated

`,
  Sweeteners: `Sweeteners Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Sweetener scoring places special emphasis on processing level, authenticity (especially for honey and maple syrup), and hidden fillers commonly found in "natural" sweetener products.

Evaluation Factors
Our sweeteners scoring system evaluates products based on the following criteria:

Processing level - Refinement, heat treatment, and bleaching
Sweetener type - Base type, artificial sweeteners, and sugar alcohols
Fillers & additives - Bulking agents, natural flavors, colors
Authenticity & sourcing - Origin, adulteration risk, organic status
Packaging - Container material safety
Scoring Components
Processing Level
Penalty Range: 0-30 points

Refinement Level
Unprocessed (raw local honey, coconut sugar): 0 points
Minimally processed (raw honey, grade A maple): 3 points
Refined (brown sugar, conventional agave): 12 points
Highly refined (white sugar, HFCS): 20 points
Unknown: 12 points
Heat Treatment (Honey)
Raw / unpasteurized: 0 points (preserves enzymes and pollen)
Lightly filtered: 3 points
Ultra-filtered / pasteurized: 10 points (destroys beneficial compounds)
Bleaching
Bleached (white sugar): 8 additional points
Sweetener Type
Penalty Range: 0-25 points

Base Type
Raw honey / pure monk fruit / pure stevia leaf: 0 points
Maple syrup (pure): 3 points
Coconut sugar: 5 points
Turbinado / raw cane: 8 points
Brown sugar: 12 points
White refined sugar / high-fructose agave: 15 points
Corn syrup: 20 points
High fructose corn syrup: 25 points (highest penalty)
Artificial Sweeteners
Aspartame: 20 points (recently classified as "possibly carcinogenic" by IARC)
Saccharin: 18 points
Sucralose / Acesulfame-K: 15 points
None: 0 points
Sugar Alcohols
Maltitol: 10 points (high glycemic impact)
Sorbitol: 8 points
Erythritol / Xylitol: 3 points (generally well tolerated)
Allulose: 2 points
None: 0 points
Fillers & Additives
Penalty Range: 0-25 points

Many "natural" sweeteners contain hidden fillers:

Bulking Agents
Maltodextrin: 15 points (spikes blood sugar higher than table sugar)
Dextrose: 12 points (essentially sugar used as filler)
Erythritol filler: 5 points (less concerning but still filler)
Inulin: 3 points
Other Additives
"Natural flavors": 5 points (undisclosed flavor compounds)
Caramel color: 8 points (potential 4-MEI carcinogen, often in fake "maple syrup")
Artificial colors: 12 points
Anti-caking agents (silicon dioxide, calcium silicate): 3 points
Authenticity & Sourcing
Penalty Range: 0-20 points

Honey Authenticity (Major Fraud Category)
Single-source local: 0 points (highest quality, traceable)
Single country (non-China): 5 points
Single country (China): 10 points (high adulteration risk)
Blended multi-country: 12 points (often cut with corn syrup)
Origin unlisted: 15 points (likely blended or adulterated)
Honey Adulteration Indicators
True Source Certified: 0 points (verified purity)
Ultra-filtered: 10 points (removes pollen - sign of honey laundering)
"Honey blend" or "honey product": 20 points (not real honey)
Maple Syrup Authenticity
Pure maple syrup: 0 points
Blended maple: 10 points
"Maple flavored" / "pancake syrup": 25 points (not real maple - mostly corn syrup)
Organic Status
Not organic: 5 additional points
Packaging
Penalty Range: 0-10 points

Glass jar/bottle: 0 points (inert, best option)
BPA-lined metal: 7 points
Plastic squeeze bottle: 8 points (common for honey)
Plastic jar/bottle: 6 points
Unknown: 4 points
Certification Bonuses (Max +10)
USDA Organic: +4 points
Raw/unpasteurized: +4 points (honey)
True Source Certified: +4 points (honey authenticity)
Local sourced: +3 points
Single ingredient: +3 points
Regenerative sourcing: +3 points
Glass packaging: +2 points
Score Interpretation
Score Ranges
90-100: Excellent - Pure, raw/minimally processed, organic, authentic
80-89: Good - Quality product with minor concerns
70-79: Fair - Some processing or sourcing concerns
60-69: Poor - Significant processing, fillers, or authenticity issues
Below 60: Very Poor - Highly refined, fake, or heavily adulterated
Health Considerations
Honey Fraud
Honey is one of the most adulterated foods in the world:

Ultra-filtering removes pollen, making origin untraceable (used to launder Chinese honey)
Corn syrup blending is common in low-cost honey products
"Honey blend" labels indicate the product is not pure honey
True Source Certified is the best indicator of authentic honey
Maple Syrup vs. "Pancake Syrup"
Pure maple syrup is made from maple tree sap with minimal processing
"Pancake syrup" or "maple-flavored syrup" is typically corn syrup with caramel color and artificial flavor
Check the ingredient list: real maple syrup should have ONE ingredient
Common Concerns
HFCS: Linked to obesity, fatty liver disease, and metabolic syndrome
Artificial sweeteners: Emerging research on gut microbiome disruption
Maltodextrin filler: Glycemic index of ~100 (higher than table sugar)
Caramel color: May contain 4-MEI, a possible carcinogen
Plastic containers: Chemical leaching, especially with viscous products
Best Practices
Choose raw, local honey from a single source
Verify honey authenticity with True Source Certification
Buy real maple syrup (check for single ingredient)
Avoid products labeled "blend", "flavored", or "product"
Choose glass containers over plastic
Prefer organic options to reduce pesticide exposure
Read ingredient lists carefully - quality sweeteners need minimal ingredients
If using stevia or monk fruit, choose pure extracts without maltodextrin filler
Limitations
Scores reflect available certifications and ingredient disclosures
Honey adulteration testing is not universally available
Raw honey carries a small botulism risk for infants under 12 months
Individual glycemic responses to sweeteners vary
Taste preference is not evaluated
Environmental impact of sweetener production is not scored`,
  "Tea Products": `Tea Products Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Tea products receive particularly strict evaluation because tea bags are steeped in hot water — a process that dramatically accelerates microplastic shedding and chemical leaching from packaging materials.

Strict Lab Report Requirement
Tea products without a full lab report receive a 70-point penalty, resulting in a maximum possible score of 30 (Very Poor). This reflects the high contamination risks in tea from heavy metals, pesticides, and packaging materials. Products with lab reports from other SKUs that showed contaminants receive a 20-point penalty.

Evaluation Factors
Our tea scoring system evaluates products based on the following criteria:

Lab verification - Third-party testing for contaminants (critical)
Contaminants - Heavy metals, pesticides, and other harmful substances
Tea bag material - Microplastic shedding and chemical leaching potential
Organic certification - Pesticide residue concerns
Certifications - Additional safety certifications
Scoring Components
Lab Verification
Penalty: Up to 70 points if missing

Tea products require comprehensive lab reports:

Full lab report available: 0 points
No lab report (category weighted on ingredients/packaging): 15 points
No lab report (standard category): 70 points (max score of 30)
No lab report + other SKU has contaminants: 20 points
Contaminant Penalties
Penalty Range: Up to 80 points total

All tea ingredients/contaminants are individually analyzed:

Each contaminant receives a severity score based on health impact
Contaminants with guidelines and measured amounts use multiplier-based scaling
Contaminants over guidelines receive amplified penalties (up to 8x for contaminants)
Harmful non-contaminant ingredients receive 3x severity multiplier
Tea Bag Material
Penalty Range: 0-40+ points per material

Tea bag material penalties are among the highest in our system because of direct contact with boiling water:

Highest Concern
Nylon: 40 points (releases billions of micro/nanoplastics when steeped)
Polyester: 40 points (similar to nylon — synthetic polymer shedding)
Polypropylene: 35 points (heat-seal material on many bags)
Polyethylene: 35 points (plastic seal material)
Moderate Concern
Unknown material: 25 points (unverified = assume risk)
Low Concern
Polylactic acid (PLA): 5 points (plant-based plastic, lower shedding)
Plant-based materials: 5 points
Paper: 5 points (minimal concern)
Cellulose: 5 points (natural fiber)
No Concern
Cotton: 0 points
Silk: 0 points
Multiple Materials
When tea bags contain multiple materials, a 20% reduction is applied to avoid excessive double-penalization.

Microplastic-Free Certification
Products certified as microplastic-free have their packaging penalty removed entirely (0 points).

Organic Certification
Penalty: Variable if missing

Tea categories that require organic certification receive a 25-point penalty if the product lacks organic certification. Tea is a particularly high-risk crop for pesticide residues.

Certification Bonuses
Products with verified certifications receive score bonuses applied through the certification system.

Score Interpretation
Score Ranges
90-100: Excellent - Lab tested, clean results, safe packaging, organic
80-89: Good - Tested with minor concerns, safe materials
70-79: Fair - Some contaminant concerns or non-organic
60-69: Poor - Moderate contamination or unsafe tea bag materials
Below 60: Very Poor - Major concerns or untested
Below 30: Not lab tested — insufficient data for reliable scoring
Health Considerations
Tea Bag Microplastics
Research has shown that a single plastic tea bag steeped at 95°C can release:

11.6 billion microplastics
3.1 billion nanoplastics
These particles are small enough to penetrate cells and accumulate in organs. Common tea bag materials (nylon, PET, polypropylene) all shed significant microplastics when exposed to hot water.

Common Concerns
Heavy metals: Lead, cadmium, and arsenic accumulate in tea leaves from soil
Pesticide residues: Conventional tea farms use significant pesticide applications
Microplastics: Released from synthetic tea bags during steeping
Fluoride: Tea plants naturally accumulate fluoride from soil
Mycotoxins: Can develop during improper storage
Bleached tea bags: Paper bags may contain chlorine bleaching residues
Best Practices
Choose loose leaf tea to avoid tea bag materials entirely
If using tea bags, select cotton, silk, or cellulose-based bags
Avoid nylon, polyester, and polypropylene tea bags
Buy organic tea to reduce pesticide exposure
Look for brands with published lab reports
Prefer brands with microplastic-free certification
Steep at appropriate temperatures (not all teas need boiling water)
Choose reputable tea brands that test for heavy metals
Store tea properly to prevent mycotoxin growth
Limitations
Scores heavily depend on lab report availability
Tea bag material information is not always disclosed
Heavy metal content varies by growing region and soil conditions
Steeping temperature and duration affect actual exposure levels
Individual sensitivity to contaminants varies
Beneficial compounds in tea (antioxidants, L-theanine) are not scored
Water quality used for brewing also affects safety
`,
  "Meat & Seafood": `Meat & Seafood Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Meat and seafood products are routed to specialized scorers based on their subcategory, each with tailored evaluation criteria.

Subcategory Routing
Products are automatically routed to specialized scoring:

Meat (beef, pork, lamb): Contaminants, sourcing, processing, nutrition, packaging
Poultry (chicken, turkey, duck): Enhanced processing focus with chilling and chemical wash evaluation
Seafood (fish, shellfish): Mercury/PCB focus, farmed practices evaluation, sustainability
Processed meat (deli, bacon, sausage, hot dogs): Heavy processing/additives focus, WHO carcinogen factors
Meat alternatives (plant-based): Processing level, oil quality, sodium, nutrition
Meat (Beef, Pork, Lamb)
Scoring Pillars
Contaminants (max -35 pts)
Lead: 0-25 points (none to high)
Cadmium: 0-15 points
Arsenic: 0-20 points
Antibiotics detected: 15 points
Growth hormones detected: 10 points
Pork: Ractopamine detected: 15 additional points
Sourcing & Farming (max -30 pts)
Feeding regime: 0-10 points (grass-fed pasture-raised to conventional grain-fed)
Antibiotic use: 0-10 points (never to routine preventive)
Hormone use: 0-8 points (no hormones to hormones administered)
Living conditions: 0-7 points (pasture-raised to conventional)
Origin: 20 points if imported, unknown, or not verified domestic. Only meat verified as born, raised, AND processed in the USA receives no origin penalty. "Processed in USA" counts as imported — it only means the animal was slaughtered and packaged here, not born or raised here. High-risk origins (FDA refusal data): 25 points.
Pork: Gestation crate status: 0-8 points
Pork: Not ractopamine-free: 12 points (banned in 160+ countries)
Lamb: Origin-specific: 0-5 points (New Zealand/Australia best, US often feedlot-finished)
Origin Transparency: "Processed in USA" vs True Origin
Country of Origin Labeling (COOL) was repealed for beef and pork in 2015. "Processed in USA" only means the animal was slaughtered and packaged domestically — the cattle may have been born and raised in Brazil, Australia, Uruguay, or other countries. The US imported nearly 5 billion pounds of beef in 2024-2025. As of January 2026, only the voluntary "Product of USA" claim requires born, raised, and processed entirely in the US. Products with verified domestic origin (born + raised + processed in USA) receive a scoring bonus.

Processing (max -15 pts)
Injected (e.g. sodium and broth): 8 points
CO treated (color enhancement): 5 points — we also track whether CO/MAP treatment is disclosed on the label or product specs when determinable (U.S. law does not impose a simple universal on-pack CO disclosure rule for typical retail meat; disclosure is inconsistent)
Chemical tenderizers: 5 points
Beef: LFTB ("pink slime"): 10 points
Nutritional Quality (max -15 pts)
Omega-6:3 ratio: 0-8 points (ideal under 5, worst over 15)
Saturated fat: 0-5 points per serving
Low protein density: 3 points
Packaging (max -20 pts)
PVC wrap: 16 points | Styrofoam tray: 10 points | Standard plastic/vacuum sealed: 6 points
BPA lining: 14 points | BPS present: 8 points | PFAS packaging: 16 points
Aluminum can: 4 points | Cardboard: 2 points
Paper/butcher wrap or glass: 0 points
Bonuses (max +10 pts)
USDA Organic (+5), Regenerative Organic (+5), AGA Certified (+4), Animal Welfare Approved (+4), Certified Humane (+3), Third-party tested (+3), Non-GMO (+2), Local sourced (+2)
Verified domestic origin — born, raised, and processed in USA (+2)
Beef: Dry-aged (+2) | Pork: Heritage breed (+3) | Lamb: 100% grass-fed (+3)
Poultry (Chicken, Turkey, Duck)
Scoring Pillars
Contaminants (max -30 pts)
Lead: 0-25 points | Arsenic: 0-20 points
Antibiotics detected: 15 points
Chicken: Arsenic in feed (historical roxarsone issue): 0-12 additional points based on ppm
Sourcing & Farming (max -25 pts)
Living conditions: 0-10 points (pasture-raised to conventional)
Feed quality: 0-8 points (grass-fed to conventional grain)
Antibiotic use: 0-10 points | Hormone use: 0-8 points
Processing Method (max -25 pts) — Poultry-Specific
Chilling method: 0-8 points
Air-chilled: 0 points (gold standard)
Water-chilled (no chlorine): 5 points
Water-chilled (chlorine bath): 8 points
Chemical wash: 0-8 points
None certified: 0 | Peracetic acid: 6 | Chlorine dioxide: 8 (banned in EU)
Retained water: 0-10 points (>8% excessive)
Injected: 10 points (e.g. sodium and broth)
Nutritional Quality (max -10 pts)
Saturated fat: 0-5 points | Low protein density: 3 points
Packaging (max -10 pts)
Same as meat packaging evaluation.

Bonuses (max +10 pts)
USDA Organic (+5), Regenerative Organic (+5), Animal Welfare Approved (+4), Certified Humane (+3), Third-party tested (+3), Non-GMO (+2), Local sourced (+2)
Seafood (Fish, Shellfish, Canned Seafood)
Scoring Pillars
Contaminants (max -45 pts)
Seafood receives the highest contaminant penalty cap due to bioaccumulation:

Mercury: 0-30 points (highest concern for seafood)
Lead: 0-20 points | PCBs: 0-20 points | Dioxins: 0-15 points
Microplastics: 0-10 points
Species-specific mercury auto-penalty: 0-20 points
High risk (shark, swordfish, king mackerel, tilefish, bigeye tuna): 20 points
Moderate risk (albacore tuna, halibut, snapper, grouper): 10 points
Low risk (salmon, sardines, anchovies, shrimp, tilapia): 0 points
Sourcing & Origin Risk (max -30 pts)
Source: 0-15 points (wild-caught sustainable to farmed conventional)
Sustainability: 0-15 points (Seafood Watch Best Choice to Avoid)
Fishing method: 0-8 points (pole-caught best, bottom trawling worst)
Origin: 7-10 points if unlisted or high-risk
We also research and surface additional origin risk data that informs sourcing evaluation:

Origin risk tier: Based on FDA import refusal data — India, Vietnam, China, Bangladesh classified as high risk; Thailand, Indonesia as moderate
FDA import alert status: Active alert numbers (e.g. 16-124 for aquaculture drugs, 16-129 for unapproved additives) — publicly searchable data
EU restrictions: Whether the EU has enhanced testing or bans on imports from this origin (e.g. 50% testing requirement for Indian shrimp)
Farmed Practices (max -20 pts, only for farmed)
Antibiotic use: 0-12 points | Feed quality: 0-8 points | Stocking density: 0-7 points
We also research farmed-specific factors that provide critical context:

Feed additives: Ethoxyquin (banned by EU in 2022 as feed additive, no US limits, accumulates in fatty tissue), BHT/BHA in feed (carcinogenicity evidence), synthetic astaxanthin (petrochemical-derived color vs natural source in farmed salmon)
Feed composition: Plant-based percentage (soy/corn → GMO and omega-6 concerns) vs fishmeal ratio
Country-level antibiotic usage: Norway uses 0.17g/ton vs Chile at 660g/ton — a 4,000x difference for products that carry the same "farmed salmon" label
Raised without antibiotics claim: Whether the label explicitly states it, cross-referenced against country-level data
Processing (max -15 pts)
Freshness: 0-8 points (fresh/flash-frozen best, previously frozen-thawed worst)
STPP (sodium tripolyphosphate): 10 points (water retention chemical)
CO treated: 7 points (artificial color preservation)
CO labeling: Whether CO treatment is disclosed on the label or specs when determinable. There is no single federal “must label CO on the package” rule that applies uniformly; “unknown” does not mean untreated.
Excessive glaze (>20%): 8 points
Parasite Safety & Raw Consumption (Seafood-Specific)
Sushi/sashimi-grade labeling: Whether the product is explicitly labeled for raw consumption
FDA parasite destruction compliance: Whether the product has been frozen to FDA specs (-4°F for 7 days or -31°F for 15 hours)
Histamine Risk
Histidine-rich fish (tuna, mackerel, mahi mahi, bluefish) can produce histamine during spoilage, causing scombroid poisoning. Histamine is not destroyed by cooking. CO treatment is particularly dangerous for these species because it masks the visual signs of spoilage while histamine continues to build.

Certification Credibility
We cross-reference BAP, MSC, and ASC certifications against origin risk and enforcement history
Multiple 4-star BAP certified processors have been caught with banned drugs (e.g. chloramphenicol, nitrofurans)
Certifications from high-risk origins receive a reliability note rather than automatic score benefit
Packaging (max -10 pts)
Same as meat packaging evaluation.

Bonuses (max +10 pts)
MSC Certified (+4), Third-party mercury tested (+4), USDA Organic (+4), Regenerative Organic (+5), ASC Certified (+3), BAP Certified (+3), Seafood Watch Best Choice (+3), Fair Trade (+2), Local sourced (+2)
Processed Meat (Deli, Bacon, Sausage, Hot Dogs)
WHO Classification
Processed meat is classified as a Group 1 carcinogen by the World Health Organization (WHO). Products with added nitrites/nitrates receive additional flags in our scoring system.

Scoring Pillars
Contaminants (max -25 pts)
Lead: 0-20 points | Antibiotics detected: 12 points | Growth hormones: 8 points
Sourcing (max -20 pts)
Feeding regime: 0-8 points | Antibiotic use: 0-8 points
Hormone use: 0-6 points | Living conditions: 0-6 points
Processing & Additives (max -35 pts) — Heavily Weighted
Nitrates/nitrites: 0-15 points
Sodium nitrite added: 15 | Celery powder (hidden nitrates): 10 | None: 0
Sodium per serving: 2-15 points (200mg to 600mg+)
BHA/BHT: 8 points | Artificial colors: 8 points
Phosphates: 5 points | Carrageenan: 5 points
Artificial flavors: 5 points | MSG/hydrolyzed proteins: 5 points
Added sugars: 0-5 points
Excessive additives (>5 concerning): 10 additional points
Nutritional Quality (max -15 pts)
Saturated fat: 0-5 points | Low protein density: 3 points
Packaging (max -10 pts)
Same as meat packaging evaluation.

Bonuses (max +10 pts)
Same as meat bonuses.

Meat Alternatives (Plant-Based)
Scoring Pillars
Processing Level (max -30 pts)
Ingredient count: 0-15 points (under 5 ideal, 20+ ultra-processed)
Protein source: 0-8 points (whole food to highly isolated protein)
Binder type: 0-5 points
Oil Quality (max -25 pts)
Primary fat source: Variable (coconut/olive best, canola/soy worst)
Contains seed oils: Additional penalty
Saturated fat per serving: 0-5 points
Sodium & Additives (max -25 pts)
Sodium per serving: 0-12 points | Artificial colors/flavors: 5-8 points
Natural flavors: 3 points
Non-organic soy (glyphosate risk): 8 points
Nutritional Quality (max -15 pts)
Protein per serving: 0-8 points | Incomplete amino acids: 3 points
No B12 fortification: 3 points | Added sugars: 0-5 points
Packaging (max -10 pts)
Standard packaging penalties + BPA lining (+7), BPS (+4), PFAS packaging (+8)
Bonuses (max +10 pts)
USDA Organic (+5), Regenerative Organic (+5), Third-party tested (+3), Non-GMO (+2), Whole food ingredients (under 5 ingredients, +3)
Supply Chain Transparency (All Subcategories)
In addition to scoring, we research and surface supply chain data for all meat and seafood products. This information is displayed alongside scores to provide complete context.

Supplier name: When available (e.g. "Kader Exports", "CP Foods", "Acme Smoked Fish Corp")
Country of origin: Where the animal was born and raised — tracked for all products, with risk tier classification based on FDA refusal data
Origin label claim: What the label actually claims (e.g. "Product of USA", "Processed in USA", "Born, Raised and Processed in USA") — critical distinction since "Processed in USA" does not guarantee domestic origin
Likely import origins: When origin is undisclosed, likely source countries based on brand sourcing research
Processing country: Where the meat was slaughtered/processed (may differ from birth/raising country)
COOL exemption status: Whether the product category is exempt from Country of Origin Labeling (beef and pork exempt since 2015)
FDA import alert status: Whether the origin country or supplier is currently subject to active FDA import alerts (e.g. 16-124 for aquaculture drugs, 16-129 for unapproved additives)
Score Interpretation
Score Ranges (All Subcategories)
90-100: Excellent - Clean sourcing, minimal contaminants, safe packaging
80-89: Good - Minor concerns, generally safe
70-79: Fair - Some sourcing or processing concerns
60-69: Poor - Significant issues with contaminants, processing, or sourcing
Below 60: Very Poor - Major health concerns, seek alternatives
Best Practices
Choose pasture-raised, grass-fed, or wild-caught options when possible
Avoid processed meats or choose nitrate-free options
For seafood, check mercury risk for your species
Prefer air-chilled poultry over water-chilled
Look for MSC, ASC, or Certified Humane certifications — but verify origin risk
Choose glass or paper packaging over plastic
For meat alternatives, look for short ingredient lists and no seed oils
For farmed seafood, check the country of origin — antibiotic usage rates vary by orders of magnitude
For histamine-risk species (tuna, mackerel, mahi mahi), be wary of CO-treated products
For beef and pork, look beyond "Processed in USA" — ask where the cattle were actually born and raised. Look for the "Product of USA" claim (post-2026 requires born + raised + processed in US) or explicit domestic origin statements
"100% Grass Fed" + "Processed in USA" is often a sign of imported beef (Australia, Uruguay, New Zealand) — most US cattle are grain-finished
Limitations
Scores reflect available certifications and disclosed information
Contaminant levels can vary by batch and season
Mercury levels in fish vary by region and individual specimen
"Natural" and "free-range" labels may not guarantee quality
Individual dietary needs and sensitivities vary
Environmental sustainability is noted but not the primary scoring factor
"Sushi-grade" and "sashimi-grade" are marketing terms with no FDA regulatory definition
FDA import alert data may not reflect current supplier practices if issues have been resolved
Certification reliability notes reflect historical enforcement actions and may not represent current compliance
For beef and pork, Country of Origin Labeling (COOL) was repealed in 2015 — origin cannot always be definitively determined. "Likely import origins" are based on brand sourcing research but may not reflect exact batch sourcing
"Processed in USA" labels provide no information about where the animal was born or raised

`,
  "Cleaning Agents": `Cleaning Agents Scoring Methodology
Our cleaning agents scoring system evaluates laundry pods, dishwasher pods, surface cleaners, and other household cleaning products based on ingredient safety, pH levels, VOC content, and exposure factors.

Scoring Formula
Final Score = 100 – (Ingredient Penalties + pH Penalty + VOC Penalty + Form Factor Penalty)

Scoring Components
Ingredient Severity Penalties (up to 80 points)
Each ingredient is evaluated based on its severity score (0-5 scale):

Severity multiplier: 3.5 × severity_score per ingredient
Exposure multiplier:
Leave-on products: ×1.1 (higher exposure risk)
Rinse-off products: ×0.6 (lower exposure risk)
Maximum ingredient penalty: Capped at 80 points
Common Harmful Ingredients
Surfactants: Sodium lauryl sulfate, harsh detergents
Preservatives: Methylisothiazolinone (MIT), formaldehyde donors
Fragrances: Synthetic fragrances, phthalates
Solvents: Harsh solvents, alcohols
Bleaching agents: Chlorine bleach, peroxide-based cleaners
Acids/Alkalis: Strong pH adjusters
pH Penalty (0–12 points)
pH levels indicate corrosivity and potential for skin/eye irritation:

Highly corrosive (pH <3 or >11): +12 points
Moderately corrosive (pH 3-4 or 10-11): +6 points
Safe range (pH 4-10): 0 points
VOC Penalty (0–10 points)
Volatile Organic Compounds contribute to indoor air pollution:

For spray/aerosol products only:

VOC content >20%: +10 points
VOC content 10-20%: +5 points
VOC content <10%: 0 points
Form Factor Penalty (0–4 points)
Product form affects exposure risk:

Pods/capsules: +4 points (ingestion risk, especially for children)
Sprays/aerosols: +2 points (inhalation risk)
Liquids/powders: 0 points
Product-Specific Considerations
Laundry Pods
Ingestion risk: High concern for accidental ingestion, especially by children
Concentrated formulas: Higher ingredient concentrations increase exposure
Dissolution: Pods dissolve in water, reducing direct contact but increasing environmental impact
Dishwasher Pods
Ingestion risk: Similar to laundry pods, high concern for accidental ingestion
High pH: Many dishwasher detergents are highly alkaline (pH 9-11)
Rinse-off exposure: Lower direct contact but potential residue concerns
Surface Cleaners
Spray formulations: Higher VOC and inhalation concerns
Leave-on vs. rinse-off: Leave-on products have higher exposure multipliers
pH considerations: Strong acids or alkalis increase corrosivity penalties
Wipes
Dermal exposure: Direct skin contact increases exposure risk
Preservatives: Wipes require preservatives, which may include sensitizers
Disposal: Single-use products have environmental considerations
Score Interpretation
Score Ranges
90-100: Excellent - Minimal health concerns, safe ingredients
75-89: Good - Minor concerns, generally safe with proper use
60-74: Fair - Some concerning ingredients, use with caution
45-59: Concerning - Significant health concerns, consider alternatives
0-44: Poor - Major health risks, avoid if possible
Health Considerations
Common Concerns
Skin irritation: Harsh surfactants and high pH can cause dermatitis
Respiratory issues: VOCs and aerosols can trigger asthma and respiratory irritation
Eye damage: Corrosive pH levels can cause serious eye injury
Sensitization: Preservatives like MIT have high sensitization rates
Accidental ingestion: Pods pose serious risk, especially to children
Best Practices
Choose products with lower pH (closer to neutral)
Prefer fragrance-free options to reduce sensitization risk
Use rinse-off products when possible
Ensure proper ventilation when using sprays
Store pods securely away from children
Consider plant-based or certified safer alternatives
Read and follow all safety warnings
Safety Standards
Regulatory Considerations
EPA Safer Choice: Products meeting EPA's safer chemical standards
EU CLP Regulation: European classification and labeling requirements
NSF Certification: Third-party safety verification for cleaning products
Limitations
Scores reflect available ingredient and testing data
Individual sensitivities may vary significantly
Proper use and dilution are critical for safety
Environmental impact is not included in health scores
Some ingredients may have unknown long-term effects

`,
  "Home Essentials": `Home Essentials Scoring Methodology
Our home essentials scoring system evaluates paper towels, toilet paper, sponges, dish soap, and other household products based on material composition and safety.

Scoring Formula
Final Score = Base Score (90 or 100) – Material Penalties

Scoring Components
Base Score
Products with harmful materials: Start at 90 points
Products without harmful materials: Start at 100 points
Material Penalties (up to 99 points)
Materials are evaluated based on their severity scores (0-5 scale):

Penalty calculation: (percentage/100) × severity_score × 25
Maximum penalty: Capped at 99 points to ensure minimum score of 1
Common Materials Evaluated
Paper Products (Paper Towels, Toilet Paper)

Virgin wood pulp: Severity 2-3 (deforestation, bleaching concerns)
Recycled paper fiber: Severity 0, Bonus 5 (sustainable, no penalty)
Bleached materials: Higher severity scores due to chemical processing
Dyes and fragrances: Additional severity considerations
Sponges

Synthetic materials: Various severity scores based on chemical composition
Natural materials: Generally lower severity scores
Antimicrobial treatments: May increase severity scores
Dish Soap & Cleaning Products

Surfactants: Severity based on irritation potential
Preservatives: Severity based on sensitization risk
Fragrances: Severity based on allergen potential
Score Interpretation
Score Ranges
90-100: Excellent - Safe materials, minimal health concerns
75-89: Good - Minor material concerns, generally safe
60-74: Fair - Some concerning materials, consider alternatives
45-59: Concerning - Significant material concerns
0-44: Poor - Major health concerns, avoid if possible
Material-Specific Considerations
Paper Products
Virgin Wood Pulp
Deforestation impact: Environmental and sustainability concerns
Bleaching process: Chlorine bleaching creates harmful byproducts
Severity scoring: Higher scores for bleached virgin pulp
Recycled Paper Fiber
Sustainability bonus: Recycled materials receive bonus scores
Lower severity: Generally lower health concerns
Quality considerations: May have lower absorbency but better environmental profile
Dyes and Fragrances
Synthetic dyes: May contain harmful chemicals
Fragrances: Can cause allergic reactions and sensitivities
Unbleached options: Generally preferred for reduced chemical exposure
Sponges
Synthetic Sponges
Plastic materials: May leach microplastics
Antimicrobial treatments: Triclosan and other treatments have health concerns
Durability vs. safety: Trade-offs between product lifespan and material safety
Natural Sponges
Cellulose sponges: Generally safer material options
Loofah: Natural alternative with lower severity scores
Biodegradability: Better environmental profile
Health Considerations
Common Concerns
Chemical residues: Bleaching agents, dyes, and fragrances in paper products
Microplastics: Synthetic sponges may release microplastics during use
Skin irritation: Harsh materials in cleaning products can cause dermatitis
Respiratory issues: Fragrances and chemical treatments can trigger sensitivities
Environmental impact: Virgin materials contribute to deforestation and waste
Best Practices
Choose unbleached or naturally bleached paper products
Prefer recycled paper products when available
Select fragrance-free options to reduce allergen exposure
Use natural sponge alternatives when possible
Avoid antimicrobial-treated products unless necessary
Consider reusable alternatives to reduce waste
Environmental Considerations
While environmental impact is not directly included in health scores, material choices affect both:

Recycled content: Reduces waste and resource consumption
Biodegradability: Natural materials break down more safely
Chemical processing: Fewer chemicals mean less environmental contamination
Packaging: Minimal packaging reduces overall environmental footprint
Limitations
Scores reflect material composition and available safety data
Individual sensitivities may vary
Environmental impact is not included in health scores
Product performance is not evaluated
Long-term health effects of some materials are still being studied

`,
  "Food Storage Containers": `Food Storage Containers Scoring Methodology
Our food storage containers scoring system evaluates containers, water bottles, and food storage products based on material composition and safety.

Scoring Formula
Final Score = Base Score (90 or 100) – Material Penalties

Scoring Components
Base Score
Products with harmful materials: Start at 90 points
Products without harmful materials: Start at 100 points
Material Penalties (up to 99 points)
Materials are evaluated based on their severity scores (0-5 scale):

Penalty calculation: (percentage/100) × severity_score × 20
Maximum penalty: Capped at 99 points to ensure minimum score of 1
Common Materials Evaluated
Glass

Borosilicate glass: Severity 0 (safest option)
Soda-lime glass: Severity 0 (generally safe)
Lead crystal: Severity 3-4 (lead leaching concerns)
Stainless Steel

Food-grade stainless steel: Severity 0-1 (generally safe)
304/316 stainless: Severity 0 (preferred grades)
Nickel concerns: May affect nickel-sensitive individuals
Plastics

Polypropylene (PP) #5: Severity 0-1 (generally safe)
High-density polyethylene (HDPE) #2: Severity 0-1 (generally safe)
Polyethylene terephthalate (PET) #1: Severity 1-2 (single-use concerns)
Polycarbonate #7: Severity 3-4 (BPA concerns)
Polystyrene #6: Severity 2-3 (styrene concerns)
PVC #3: Severity 3-4 (phthalate concerns)
Silicone

Food-grade silicone: Severity 0-1 (generally safe)
Platinum-cured: Severity 0 (preferred)
Peroxide-cured: Severity 1 (may have residual chemicals)
Aluminum

Anodized aluminum: Severity 1-2 (coating concerns)
Uncoated aluminum: Severity 2-3 (leaching concerns)
Aluminum with lining: Severity depends on lining material
Ceramic

Glazed ceramic: Severity 1-2 (lead in glazes)
Unglazed ceramic: Severity 0-1 (generally safe)
Lead-free glazes: Severity 0-1 (preferred)
Score Interpretation
Score Ranges
90-100: Excellent - Safe materials, minimal health concerns
75-89: Good - Minor material concerns, generally safe
60-74: Fair - Some concerning materials, consider alternatives
45-59: Concerning - Significant material concerns
0-44: Poor - Major health concerns, avoid if possible
Material-Specific Considerations
Glass Containers
Borosilicate Glass
Heat resistance: Can withstand temperature changes
Durability: Less prone to breaking
Chemical inertness: No leaching concerns
Best choice: Preferred for all food storage
Soda-Lime Glass
Standard glass: Most common type
Generally safe: No significant leaching concerns
Temperature sensitivity: May break with rapid temperature changes
Good choice: Safe for most food storage needs
Lead Crystal
Decorative use: Not recommended for food storage
Lead leaching: Significant health concern
Avoid: Should not be used for food or beverages
Stainless Steel Containers
Food-Grade Stainless Steel
304/316 grades: Preferred for food contact
Non-reactive: Doesn't leach into food
Durability: Long-lasting material
Excellent choice: Safe and durable option
Nickel Concerns
Nickel content: May affect sensitive individuals
316 stainless: Lower nickel content
Consideration: Important for nickel allergies
Plastic Containers
Safe Plastics
PP (#5): Polypropylene, generally safe
HDPE (#2): High-density polyethylene, generally safe
LDPE (#4): Low-density polyethylene, generally safe
Use considerations: Avoid heating, check for BPA-free
Concerning Plastics
Polycarbonate (#7): BPA concerns, avoid
PVC (#3): Phthalate concerns, avoid
Polystyrene (#6): Styrene concerns, avoid
PET (#1): Single-use, not recommended for reuse
Silicone Containers
Food-Grade Silicone
Platinum-cured: Preferred method, safest
Peroxide-cured: May have residual chemicals
Flexibility: Useful for collapsible containers
Temperature resistance: Can handle heat and cold
Aluminum Containers
Anodized Aluminum
Coating protection: Reduces aluminum contact
Durability: Hard, scratch-resistant surface
Considerations: Coating integrity important
Uncoated Aluminum
Leaching concerns: Aluminum can leach into food
Acidic foods: Higher leaching risk
Avoid: Not recommended for food storage
Ceramic Containers
Lead-Free Glazes
Safe option: When properly glazed
Testing: Should be tested for lead
Considerations: Glaze integrity important
Leaded Glazes
Health risk: Lead can leach into food
Avoid: Should not be used for food storage
Regulations: Many regions restrict lead in glazes
Health Considerations
Common Concerns
Chemical leaching: Plastics, aluminum, and glazes can leach chemicals
BPA (Bisphenol A): Endocrine disruptor in polycarbonate
Phthalates: Endocrine disruptors in PVC
Lead: Neurotoxin in some glazes and crystal
Aluminum: Potential health concerns with uncoated aluminum
Microplastics: Plastic containers may shed microplastics
Best Practices
Choose glass containers when possible (safest option)
Prefer stainless steel for durability and safety
Select food-grade silicone for flexible options
Avoid polycarbonate (#7) and PVC (#3) plastics
Don't heat food in plastic containers
Avoid storing acidic foods in aluminum containers
Check for BPA-free labels on plastic products
Use lead-free ceramic glazes
Replace scratched or damaged containers
Avoid single-use plastics for food storage
Temperature Considerations
Microwave Use
Glass: Safe for microwave use
Stainless steel: Not microwave-safe
Plastic: Check microwave-safe labels, avoid if uncertain
Silicone: Generally microwave-safe
Freezer Use
Glass: May break if not freezer-safe
Stainless steel: Generally safe
Plastic: Check freezer-safe labels
Silicone: Generally freezer-safe
Oven Use
Glass: Check oven-safe labels
Stainless steel: Generally safe
Plastic: Avoid oven use
Silicone: Check temperature limits
Certifications & Standards
FDA Food Contact Approval
Food-grade materials: Must meet FDA standards
Testing requirements: Materials tested for safety
Labeling: Should indicate food-grade status
NSF Certification
Food equipment standards: Third-party verification
Material safety: Tested for food contact safety
Quality assurance: Regular testing required
Limitations
Scores reflect material composition and available safety data
Individual sensitivities may vary
Proper use and care affect safety
Temperature and usage conditions impact leaching
Long-term health effects of some materials are still being studied
Product durability and performance are not evaluated

`,
  "Bedding & Sleep Products": `Bedding & Sleep Products Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Bedding products receive special attention because of the prolonged 8+ hours of nightly exposure during sleep.

Subcategory Weight Adjustments
Bedding products are scored with subcategory-specific modifiers:

Mattresses: Flame retardants 1.5x, VOCs 1.3x (8 hours/night exposure, largest surface area)
Pillows & bedding: Materials 1.3x, PFAS 1.2x (direct face contact for pillows)
Evaluation Factors
Our bedding scoring system evaluates products based on the following criteria:

Materials - Core material, fill material, and fabric/cover composition
Flame retardants - Chemical flame retardant treatments
VOCs & off-gassing - Volatile organic compounds and adhesive emissions
PFAS & chemical treatments - Waterproofing, stain resistance, and antimicrobials
Certifications & testing - Safety certifications and material transparency
Packaging & delivery - Compressed shipping and plastic packaging
Scoring Components
Materials
Penalty Range: 0-30 points

Core Material (Mattresses)
Natural latex (100%): 0 points (best - natural, durable)
Organic cotton/wool innerspring: 0 points (natural materials)
Coils/innerspring: 0 points (no off-gassing concerns)
CertiPUR foam: 10 points (certified low emissions)
Gel memory foam: 15 points (moderate off-gassing risk)
Memory foam (conventional): 18 points (higher off-gassing)
Conventional polyurethane foam: 20 points (highest synthetic concern)
Unknown: 12 points
Fill Material (Pillows)
Organic cotton/wool/kapok: 0 points
Buckwheat hulls: 0 points
Natural latex: 3 points
Organic down/feather: 0 points
Down/feather (conventional): 5 points
CertiPUR foam: 8 points
Down alternative (synthetic): 12 points
Memory foam (conventional): 15 points
Polyester fill: 15 points
Fabric/Cover
GOTS organic cotton: 0 points
Organic linen/hemp: 0 points
Bamboo viscose: 5 points
Conventional cotton: 8 points
Polyester/synthetic blend: 12 points
Flame Retardants
Penalty Range: 0-35 points

Chemical flame retardants are a major health concern in bedding:

None / naturally resistant: 0 points (ideal)
Natural FR (wool, silica): 3 points (minimal concern)
Fiberglass barrier: 10 points (effective but can cause irritation if barrier is compromised)
Meets flammability, no detail: 20 points (transparency concern)
Organophosphate FR: 25 points (neurotoxicity risk)
Halogenated FR: 30 points (persistent, bioaccumulative)
PBDE / chemical FR unspecified: 35 points (most concerning)
Unknown: 15 points
VOCs & Off-gassing
Penalty Range: 0-25 points

VOC Emissions
No off-gassing (natural materials): 0 points
GREENGUARD Gold certified: 0 points (verified low emissions)
Low VOC certified: 5 points
Moderate VOC (CertiPUR): 10 points
No testing / high VOC: 20 points
Unknown: 12 points
Adhesive Type
None (mechanical fastening): 0 points
Water-based: 5 points
Solvent-based: 12 points
PFAS & Chemical Treatments
Penalty Range: 0-25 points

PFAS Status
None / PFAS-free certified: 0 points
Stain-resistant or waterproof (unspecified): 15 points
PFAS detected: 25 points
Unknown: 10 points
Antimicrobial Treatment
None: 0 points
Silver/copper ion: 8 points
Antimicrobial (unspecified): 10 points
Triclosan: 20 points (banned in many products)
Wrinkle/Shrink Treatment (Sheets)
None: 0 points
Easy-care/wrinkle-free: 12 points (likely formaldehyde-based)
Formaldehyde-based: 20 points
Certifications & Testing
Penalty Range: 0-15 points

No certifications: 10 points
CertiPUR-US only: 5 points (limited scope)
OEKO-TEX only: 3 points
GOTS, GOLS, GREENGUARD Gold, MADE SAFE: 0 points
Material Transparency
Full disclosure: 0 points
Partial: 5 points
None: 10 points
Unknown: 7 points
Packaging & Delivery
Penalty Range: 0-10 points

Compressed/Rolled Shipping (Bed-in-a-Box)
Not compressed: 0 points
Compressed < 30 days: 5 points (increased off-gassing period)
Compressed > 30 days: 8 points (prolonged compression increases off-gassing)
Plastic Packaging
Plastic-free: 0 points
Minimal plastic: 2 points
Heavy plastic: 5 points
Certification Bonuses (Max +10)
GOTS (Global Organic Textile Standard): +5 points
GOLS (Global Organic Latex Standard): +5 points
MADE SAFE: +5 points
All natural/organic materials: +5 points
GREENGUARD Gold: +4 points
No flame retardants: +4 points
OEKO-TEX: +3 points
Full material transparency: +3 points
B Corp: +2 points
Score Interpretation
Score Ranges
90-100: Excellent - Natural materials, no chemical treatments, fully certified
80-89: Good - Minimal concerns, mostly safe materials
70-79: Fair - Some synthetic materials or chemical treatments
60-69: Poor - Significant off-gassing or chemical concerns
Below 60: Very Poor - Multiple safety concerns, consider alternatives
Health Considerations
Common Concerns
Flame retardants: Linked to cancer, hormone disruption, and neurological effects
VOCs: Can cause respiratory irritation, headaches, and long-term health effects
PFAS: "Forever chemicals" used in stain/water resistance treatments
Formaldehyde: Found in wrinkle-free sheet treatments, classified as carcinogen
Fiberglass: Can cause skin and respiratory irritation if barrier is compromised
Off-gassing: New mattresses may emit chemicals for weeks after unboxing
Best Practices
Choose natural materials (organic cotton, wool, natural latex) when possible
Look for GOTS, GOLS, or GREENGUARD Gold certifications
Avoid wrinkle-free or stain-resistant treated sheets
Allow new mattresses to off-gas in a well-ventilated area before use
Check for "no flame retardant" certifications
Prefer brands with full material transparency
Avoid bed-in-a-box products compressed for extended periods
Limitations
Scores reflect available certifications and disclosed materials
Off-gassing levels decrease over time but initial measurements may vary
Individual chemical sensitivities vary
Some natural materials may trigger allergies (latex, down, wool)
Manufacturing processes can vary between batches
Fire safety regulations may require some flame retardant solutions`,
  Cookware: `Cookware Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Cookware safety is critical because materials are in direct contact with food at high temperatures, which can accelerate chemical leaching.

Evaluation Factors
Our cookware scoring system evaluates products based on the following criteria:

Base material - Core material safety and composition
Coating type - Surface coating safety and PFAS concerns
Heat tolerance - Safe temperature range and thermal stability
Leaching risk - Potential for chemicals to migrate into food
Durability - Longevity and resistance to degradation
Transparency - Manufacturer disclosure and testing
Scoring Components
Base Material Safety
Penalty Range: 0-40 points

The base material is the most critical factor for cookware safety:

Safest Materials (0 points)
Cast iron: Durable, naturally nonstick when seasoned, adds dietary iron
Carbon steel: Similar to cast iron, excellent heat distribution
18/10 stainless steel: High chromium and nickel content, corrosion resistant
100% ceramic: No chemical coatings, excellent heat distribution
Borosilicate glass: Completely inert, no leaching
Enameled cast iron: Protective enamel coating over cast iron
Moderate Concern (10-20 points)
18/0 stainless steel: ~15 points (lower corrosion resistance, potential nickel leaching)
Silicone: ~15 points (generally safe but some quality concerns)
Higher Concern (20-35 points)
Anodized aluminum: ~27 points (oxidized layer reduces but doesn't eliminate aluminum leaching)
Highest Concern (40 points)
Bare aluminum: Reactive metal, leaches into acidic foods
Unlined copper: Toxic copper leaching into food
PTFE-based (with PFAS): Forever chemicals that degrade at high temperatures
Coating Safety
Penalty Range: 0-40 points

Safe Coatings (0 points)
No coating: Bare cast iron, carbon steel, stainless
100% ceramic: Traditional ceramic glaze
Lead-free enamel: Protective vitreous coating
Moderate Concern (5-15 points)
PFAS-free ceramic nonstick: ~10 points (generally safe but less durable)
Sol-gel ceramic: ~10 points (newer technology, limited long-term data)
High Concern (30-40 points)
PTFE (Teflon): ~35 points (releases toxic fumes above 500°F, contains PFAS)
PFAS fluoropolymer nonstick: ~35 points (forever chemicals)
Heat Tolerance
Penalty Range: 0-20 points

Safe above 600°F: 1 point (cast iron, carbon steel, stainless)
400-600°F range: 7 points (ceramic nonstick, some coatings)
Below 400°F / not oven safe: 17 points (PTFE, some nonstick coatings)
Note: PTFE coatings begin to decompose above 500°F, releasing toxic fumes that can cause polymer fume fever.

Leaching Risk
Penalty Range: 0-20 points

Glass, carbon steel, cast iron: 0 points (minimal leaching)
18/10 stainless, anodized aluminum, copper-lined: 2 points (very low risk)
18/0 stainless, tested ceramic: 7 points (moderate risk)
Bare aluminum, unlined copper, scratched PFAS: 17 points (high leaching risk)
Durability
Penalty Range: 0-10 points

Durability matters because degraded cookware leaches more chemicals:

Cast iron, carbon steel, stainless steel: 0 points (lasts generations)
Ceramic nonstick: 6 points (degrades within 1-3 years)
PTFE (Teflon): 10 points (chips and peels, releasing particles into food)
Transparency
Penalty Range: 0-10 points

Full disclosure + testing: 0 points
Partial disclosure: 3 points
Generic claims only: 7 points
No real information: 10 points
Score Interpretation
Score Ranges
90-100: Excellent - Safe materials, no coatings or safe coatings, full transparency
80-89: Good - Minor material or coating concerns
70-79: Fair - Some leaching or coating concerns
60-69: Poor - Significant material or coating safety issues
Below 60: Very Poor - PTFE, bare aluminum, or high leaching risk
Health Considerations
Common Concerns
PFAS (forever chemicals): Found in PTFE and some "ceramic" nonstick coatings
Aluminum leaching: Accelerated by acidic foods (tomato sauce, lemon juice)
Copper toxicity: Unlined copper pots can leach toxic levels of copper
Polymer fume fever: Caused by overheating PTFE-coated cookware
Lead in ceramics: Some imported ceramic glazes may contain lead
Microplastics: PTFE coatings shed microplastic particles when scratched
Best Practices
Choose cast iron, carbon steel, or stainless steel for everyday cooking
Avoid PTFE (Teflon) coated cookware, especially for high-heat cooking
If using nonstick, choose PFAS-free ceramic options and replace when coating degrades
Never heat PTFE cookware above 500°F (260°C)
Avoid cooking acidic foods in bare aluminum or unlined copper
Season cast iron and carbon steel regularly for natural nonstick properties
Look for full material and coating disclosure from manufacturers
Consider enameled cast iron for versatile, safe cooking
Limitations
Scores reflect available manufacturer disclosures
Actual leaching levels depend on cooking temperature, food acidity, and duration
Ceramic nonstick durability varies significantly by brand
Some "ceramic" coatings may contain undisclosed materials
Heat tolerance claims may not reflect real-world cooking conditions
Individual cooking habits affect actual chemical exposure

`,
  "Fragrances & Perfumes": `Fragrances & Perfumes Scoring Methodology
Our fragrance scoring system evaluates candles, perfumes, room sprays, diffusers, wax melts, and incense based on ingredient safety, transparency, emissions, and use patterns.

Scoring Formula
Final Score = 100 – (Ingredient Penalties + Transparency + Emissions + Use Pattern)

Scoring Components
A. Ingredient Penalties (0–75 points)
Ingredients are assessed based on their severity and exposure risk:

Severity Classifications
High severity (7 pts): Phthalates, synthetic musks, thick soot producers
Medium severity (4 pts): Limonene, linalool, BHT (butylated hydroxytoluene)
Low severity (2 pts): Minor sensitizers, low-risk synthetics
Exposure Multipliers
The base penalty is multiplied based on how the product is used:

Burn (candles): ×3.5 multiplier (highest exposure risk)
Spray (room sprays): ×2.5 multiplier (inhalation risk)
Leave-on (perfumes): ×2 multiplier (prolonged contact)
Diffuse (diffusers): ×1 multiplier (lowest exposure)
Multi-Ingredient Penalty
Products with many harmful ingredients receive additional penalties:

5-9 harmful ingredients: +10% additional penalty
10+ harmful ingredients: +15% additional penalty
Example: A spray with limonene (medium severity, 4 pts) would receive: 4 × 2.5 = 10 points penalty. Example: A spray with 8 harmful ingredients totaling 50 points would receive: 50 + (50 × 0.10) = 55 points penalty.

B. Transparency Penalty (0–15 points)
Ingredient disclosure transparency affects scoring:

Full ingredient list: 0 points (best practice)
IFRA allergens only: -3 points (partial disclosure)
"Fragrance" or "Parfum" only: -10 points (minimal disclosure)
No disclosure: -15 points (no transparency)
C. Emissions / Soot / VOC Penalty (0–20 points)
Candles
Paraffin wax: +10 points (petroleum-based, higher emissions)
Metal wick: +10 points (lead and other metal emissions)
High soot rating: +5 points
Medium soot rating: +2 points
Sprays & Aerosols
Hydrocarbon propellant: +10 points (higher VOC emissions)
VOC content >10%: +10 points
VOC content 5-10%: +5 points
Perfumes & Colognes
Alcohol content >80%: +4 points
Alcohol content 75-80%: +3 points
Alcohol content 70-75%: +2 points
Alcohol content 60-70%: +1 point
D. Use Pattern Penalty (0–10 points)
Frequency and environment of use affect exposure:

Daily use in small room (<200 sq ft): +10 points (highest exposure)
Daily use in large room (>200 sq ft): +5 points
Occasional use: +1 point
Weekly use: +2 points
Product-Specific Considerations
Candles
Wax type: Soy, beeswax, and coconut wax are preferred over paraffin
Wick material: Cotton or wood wicks preferred over metal-core wicks
Soot production: Lower soot ratings indicate cleaner burning
Essential oils: Higher percentage of natural essential oils may reduce synthetic fragrance concerns
Perfumes & Colognes
Alcohol content: Higher alcohol percentages increase VOC emissions
Solvent type: Ethanol, DPG (dipropylene glycol), or water-based formulations
Phthalate-free claims: Verified phthalate-free products reduce health concerns
IFRA compliance: International Fragrance Association compliance indicates safety standards
Room Sprays
Propellant type: Compressed air preferred over hydrocarbon propellants
VOC content: Lower VOC percentages reduce indoor air quality concerns
Application method: Pump sprays generally safer than aerosol sprays
Diffusers
Base oil: Fractionated coconut oil or water preferred over mineral oil
Heater type: Reed, electric, or ultrasonic diffusers have different emission profiles
Essential oil concentration: Higher natural oil content generally preferred
Score Interpretation
Score Ranges
90-100: Excellent - Minimal health concerns, transparent ingredients, low emissions
75-89: Good - Minor concerns, generally safe with good ventilation
60-74: Okay - Some concerning ingredients or emissions, use with caution
45-59: Concerning - Significant health concerns, consider alternatives
0-44: Toxic - Major health risks, avoid regular use
Health Considerations
Common Concerns
Phthalates: Endocrine disruptors linked to reproductive and developmental issues
Synthetic musks: Bioaccumulative chemicals with potential health effects
VOCs: Volatile organic compounds can cause respiratory irritation and contribute to indoor air pollution
Soot: Particulate matter from burning candles can affect air quality
Allergens: Common fragrance allergens include limonene, linalool, and benzyl compounds
Best Practices
Choose products with full ingredient disclosure
Prefer natural wax candles (soy, beeswax) over paraffin
Use in well-ventilated areas
Limit daily use, especially in small spaces
Consider phthalate-free and IFRA-compliant products
Avoid products with metal-core wicks
Limitations
Scores reflect available ingredient and testing data
Individual sensitivities may vary
Regulatory compliance doesn't guarantee safety
Natural ingredients aren't always safer than synthetics
Long-term health effects of fragrance exposure are still being studied

`,
  "Dental Care": `Dental Care Scoring Methodology
Our dental care scoring system evaluates toothpaste, mouthwash, floss, whitening products, and other oral care products. Each product starts at 100 and is penalized across four weighted axes.

Scoring Framework
Products are evaluated across four weighted categories:

Health & Safety (55%): Ingredient severity, surfactants, preservatives, alcohol, triclosan, microplastics, mouthwash-specific risks
Mucosal Exposure Risk (20%): pH extremes, contact duration, ingestion risk
Transparency & Claims Integrity (15%): Full INCI disclosure, claims substantiation
User Compatibility (10%): SLS-free, alcohol-free, microplastics-free
Each axis is scored independently out of 100, then combined using the weights above to produce the final score.

Exposure Multipliers
Penalties are scaled by product type to reflect differences in mucosal contact:

Product Type	Multiplier
Toothpaste, tooth powder, tablets, mouthwash	0.9x
Whitening strips, whitening gels	1.2x
Floss	0.8x
Health & Safety (55% weight)
This is the dominant scoring axis. Penalties come from ingredient analysis, specific chemical concerns, and product-type risks.

Ingredient Severity
Each ingredient is evaluated using its severity score and compared against health guidelines
Penalties scale logarithmically based on amount vs. guideline threshold
Maximum ingredient penalty: 80 points
Surfactants
SLS (Sodium lauryl sulfate): 8 points × exposure multiplier
Other surfactants (cocamidopropyl betaine, etc.): 4 points × exposure multiplier
No surfactants: 0 points
Preservatives
Parabens or isothiazolinones (MIT/MCI): 10 points × exposure multiplier (endocrine disruption, high sensitization)
Phenoxyethanol: 5 points × exposure multiplier (mild concern)
No concerning preservatives: 0 points
Alcohol Content
High alcohol (>10%): 10 points (drying, irritation, increased cancer risk)
Low alcohol (>0% and ≤10%): 5 points
Alcohol-free: 0 points
Triclosan
Hard penalty: 25 points (not multiplied by exposure)
Policy cap: Triclosan-containing products are capped at a maximum score of 50
Concerns: endocrine disruption, antibiotic resistance, FDA restrictions
Microplastics / Polyethylene
Detected: 15 points (non-biodegradable particles in oral tissue)
Not detected: 0 points
Artificial Sweeteners
Contains artificial sweeteners: 3 points × exposure multiplier (emerging gut microbiome concerns)
Dyes & Colorants
Contains FD&C dyes/colorants: 3 points × exposure multiplier (sensitivity, hyperactivity concerns)
Peroxide Strength (whitening products)
>6% peroxide: 8 points × exposure multiplier (tissue irritation, sensitivity)
≤6% peroxide: 0 points
Mouthwash-Specific Penalties
These penalties only apply to mouthwash products:

Nitric Oxide Disruption
Antimicrobial mouthwashes can suppress the oral nitrate-nitrite-NO pathway (Bescos et al.), affecting blood pressure regulation:

High risk: 8 points × exposure multiplier
Medium risk: 4 points × exposure multiplier
Low/none: 0 points
Microbiome Impact
Broad-spectrum antibacterial: 5 points × exposure multiplier (disrupts beneficial oral microbiome)
Chlorhexidine
Contains chlorhexidine: 5 points × exposure multiplier (Bescos research: makes mouth more acidic, may promote cavities)
Mucosal Exposure Risk (20% weight)
pH Level
Extreme pH (<4 or >9): 12 points (highly irritating to oral tissue)
Moderate pH (4–5 or 8–9): 6 points
Neutral pH (5–8): 0 points
Contact Duration
Long contact (leave-on, whitening strips): 5 points
Brief contact (rinse-off): 0 points
Ingestion Risk
Higher risk: 8 points (children's products, mouthwash)
Moderate risk: 4 points
Low risk: 0 points
Transparency & Claims Integrity (15% weight)
INCI Disclosure
Full ingredient list disclosed: 0 points
Incomplete disclosure: 15 points
Claims Substantiation
Claims supported by ingredients/evidence: 0 points
Unsubstantiated claims: 10 points
User Compatibility (10% weight)
SLS Sensitivity
Contains SLS: 10 points
SLS-free: 0 points
Alcohol Sensitivity
Contains alcohol: 5 points
Alcohol-free: 0 points
Microplastics
Contains microplastics: 10 points
Microplastics-free: 0 points
Product-Specific Considerations
Toothpaste
Exposure multiplier: 0.9x
Key factors: fluoride/HAP content, RDA abrasivity, SLS, preservatives
Sensitivity treatments (potassium nitrate, arginine) improve usability
Mouthwash
Exposure multiplier: 0.9x
Key factors: alcohol content, antimicrobial type, pH balance
Unique risks: nitric oxide disruption, microbiome impact, chlorhexidine acidity
Whitening Products
Exposure multiplier: 1.2x (highest — prolonged mucosal contact)
Key factors: peroxide concentration, ADA approval, sensitivity management
Products with >6% peroxide receive significant penalty
Floss
Exposure multiplier: 0.8x (lowest — minimal mucosal contact)
Key factors: material composition (PTFE, nylon, silk), wax coatings, flavor additives
Score Interpretation
Score Ranges
90-100: Excellent — Safe ingredients, minimal risks
75-89: Good — Minor concerns, generally safe
60-74: Fair — Some concerns, moderate safety issues
45-59: Concerning — Significant safety concerns
0-44: Poor — Major health risks, avoid
Policy Caps
Triclosan: Any product containing triclosan is capped at 50 regardless of other scores
Health Considerations
Common Concerns
Mouth ulcers: SLS and other harsh surfactants
Dry mouth: High alcohol content in mouthwash
Enamel erosion: Extreme pH or high abrasivity
Sensitization: Preservatives (parabens, MIT/MCI) and fragrances
Endocrine disruption: Parabens, triclosan
Cancer risk: High alcohol content, formaldehyde donors
Blood pressure: Antimicrobial mouthwash disrupting nitric oxide pathway
Oral microbiome: Broad-spectrum antibacterials killing beneficial bacteria
Microplastics: Polyethylene particles persisting in oral tissue
Best Practices
Choose fluoride-containing products for cavity prevention
Prefer SLS-free options if experiencing mouth irritation
Select alcohol-free mouthwash for better mucosal health
Look for ADA Seal for verified efficacy
Avoid triclosan-containing products
Consider hydroxyapatite (HAP) as a fluoride alternative
Avoid mouthwashes with chlorhexidine for daily use
Check for microplastic-free formulations
Read age-appropriate warnings carefully
Limitations
Scores reflect available ingredient and efficacy data
Individual oral health needs may vary
Professional dental care is essential regardless of product choice
Some ingredients may have unknown long-term effects
Personal sensitivities may require different product selection

`,
  "Topical Products": `Topical Products Scoring Methodology
Our topical products scoring system evaluates skincare, hair care, body care, deodorants, and cosmetics based on ingredient safety, exposure context, pH levels, and transparency.

Scoring Formula
Final Score = 100 – (Ingredient Penalties + pH Penalty + Transparency Penalty + Packaging Penalty)

Scoring Components
Ingredient Severity Penalties (up to 99 points)
Each ingredient is evaluated based on its severity score (0-5 scale):

Severity multiplier: Applied based on ingredient severity
Exposure multiplier: Based on product use context
Leave-on products: Higher multiplier (prolonged contact)
Rinse-off products: Lower multiplier (brief contact)
Surface area multiplier: Larger application areas increase exposure
Contact duration: Longer contact times increase exposure risk
Common Ingredient Concerns
Preservatives

Parabens: Endocrine disruption concerns
MIT/MCI: High sensitization rates
Formaldehyde donors: Carcinogenic potential
Phenoxyethanol: Generally safer alternative
Surfactants

Sodium lauryl sulfate (SLS): Skin irritation
Cocamidopropyl betaine: Generally milder
Sodium lauroyl sarcosinate: Gentle alternative
Fragrances

Synthetic fragrances: Allergen and sensitization concerns
Essential oils: Natural but can still cause reactions
Fragrance-free: Preferred for sensitive skin
Active Ingredients

Retinoids: Effective but can cause irritation
AHAs/BHAs: Exfoliating acids, pH-dependent
Hydroquinone: Skin lightening, safety concerns
Sunscreen actives: Oxybenzone, octinoxate concerns
pH Penalty (0–8 points)
pH levels affect skin barrier function and irritation potential:

Extreme pH (<3 or >9): +8 points (can damage skin barrier)
Moderate extremes (3-4 or 8-9): +4 points
Optimal range (4-8): 0 points (skin-friendly pH)
Transparency Penalty (0–5 points)
Ingredient disclosure affects scoring:

Full ingredient disclosure: 0 points
Incomplete disclosure: -5 points
Packaging Safety Penalty (0–9 points)
Packaging materials that may leach chemicals:

Safe packaging: 0 points
Concerning materials: 3 points per concern, maximum 9 points total
BPA and phthalates: Additional concerns
Product-Specific Considerations
Skincare Products
Cleansers
Rinse-off exposure: Lower exposure multiplier
pH balance: Important for maintaining skin barrier
Surfactant type: Milder surfactants preferred
Moisturizers & Serums
Leave-on exposure: Higher exposure multiplier
Active ingredients: Retinoids, acids, antioxidants
Preservatives: Necessary but should be safe
Sunscreens
Active ingredients: Oxybenzone, octinoxate concerns
Mineral vs. chemical: Zinc oxide, titanium dioxide generally preferred
SPF claims: Must be substantiated
Hair Care Products
Shampoos & Conditioners
Rinse-off exposure: Lower exposure multiplier
Surfactants: SLS and alternatives
Silicones: Build-up concerns vs. benefits
Hair Styling Products
Leave-on exposure: Higher exposure multiplier
Polymers: Hold ingredients, generally safe
Alcohol content: Drying potential
Body Care Products
Body Washes
Rinse-off exposure: Lower exposure multiplier
Moisturizing ingredients: Glycerin, oils
Fragrances: Can cause body-wide reactions
Lotions & Creams
Leave-on exposure: Higher exposure multiplier
Emollients: Oils, butters, silicones
Preservatives: Critical for water-based products
Deodorants & Antiperspirants
Antiperspirants
Aluminum compounds: Primary active ingredient
Aluminum concerns: Potential health risks debated
Aluminum-free alternatives: Natural deodorants
Deodorants
Antimicrobial agents: Essential oils, baking soda
Natural alternatives: Generally lower severity scores
Sensitivity concerns: Baking soda can irritate
Cosmetics
Makeup Products
Pigments: Iron oxides, mica, titanium dioxide
Preservatives: Critical for water-based products
Talc concerns: Asbestos contamination risks
Heavy metals: Lead, cadmium in some pigments
Score Interpretation
Score Ranges
90-100: Excellent - Safe ingredients, minimal health concerns
75-89: Good - Minor concerns, generally safe
60-74: Fair - Some concerning ingredients, use with caution
45-59: Concerning - Significant health concerns, consider alternatives
0-44: Poor - Major health risks, avoid if possible
Health Considerations
Common Concerns
Skin irritation: Harsh surfactants, fragrances, preservatives
Sensitization: Repeated exposure to allergens
Endocrine disruption: Parabens, phthalates, some UV filters
Skin barrier damage: Extreme pH, over-exfoliation
Photosensitivity: Some active ingredients increase sun sensitivity
Accumulation: Some ingredients may accumulate in the body
Best Practices
Choose fragrance-free products for sensitive skin
Prefer products with pH close to skin's natural pH (5-5.5)
Look for full ingredient disclosure
Patch test new products before full use
Avoid products with known allergens if you have sensitivities
Consider natural alternatives for highly sensitive individuals
Read labels carefully, especially for active ingredients
Rotate products to reduce over-exposure to specific ingredients
Regulatory Standards
FDA Regulations
Cosmetic vs. drug: Different regulations apply
Labeling requirements: Must list ingredients
Color additives: Must be FDA-approved
Claims: Drug claims require FDA approval
EU Regulations
REACH compliance: Chemical safety regulations
Cosmetic Regulation: Stricter ingredient restrictions
Allergen labeling: Required for common allergens
Limitations
Scores reflect available ingredient and safety data
Individual skin sensitivities vary significantly
Patch testing recommended for sensitive individuals
Some ingredients may have unknown long-term effects
Product performance is not evaluated
Environmental impact is not included in health scores

`,
  "Feminine Care Products": `Feminine Care Products Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Feminine care products receive enhanced scrutiny because of direct mucosal contact, prolonged wear time, and the highly absorptive nature of vaginal tissue.

Subcategory Weight Adjustments
Tampons & pads: Materials 1.3x, chemical additives 1.3x (internal/prolonged mucosal contact)
Menstrual cups & discs: PFAS/plastics 0.5x, chemicals 0.5x (silicone-based, fewer chemical concerns)
Period underwear: PFAS 1.5x (major documented PFAS issue), materials 1.2x
Evaluation Factors
Our feminine care scoring system evaluates products based on the following criteria:

Materials - Cotton source, bleaching method, synthetic materials, silicone grade
Chemical additives - Fragrance, dyes, odor neutralizers, lotions
PFAS & plastics - PFAS contamination, phthalates, plastic applicators and wrappers
Certifications & testing - Third-party testing, safety certifications, ingredient transparency
Packaging - Individual wrapping and outer packaging materials
Scoring Components
Materials
Penalty Range: 0-35 points

For Tampons, Pads & Liners
Cotton/Fiber Source

Organic cotton: 0 points (no pesticide residues)
Conventional cotton: 15 points (heavy pesticide crop — cotton uses ~16% of world's insecticides)
Cotton/rayon blend: 18 points (rayon processing concerns)
100% rayon: 20 points (dioxin risk from bleaching)
Synthetic: 20 points
Unknown: 10 points
Bleaching Method

Unbleached: 0 points
TCF (Totally Chlorine-Free): 3 points
ECF (Elemental Chlorine-Free): 8 points
Chlorine bleached: 20 points (dioxin formation)
Additional Material Concerns

Synthetic fragrance layer: 12 points
Plastic top sheet: 10 points (plastic directly against mucous membranes)
Synthetic core: 8 points
For Menstrual Cups & Discs
Silicone Grade

Medical-grade silicone: 0 points (gold standard for internal use)
TPE (Thermoplastic Elastomer): 5 points
Unknown grade: 15 points (safety unverified)
Chemical Additives
Penalty Range: 0-30 points

Synthetic fragrance: 20 points (endocrine disruptors, irritation to sensitive tissue)
Artificial dyes: 15 points (unnecessary chemical exposure to mucosal tissue)
Odor neutralizers: 12 points (chemical deodorants)
Petroleum-based lotion: 12 points (petroleum derivatives)
Aloe/vitamin coating: 3 points (mild unnecessary additive)
PFAS & Plastics
Penalty Range: 0-25 points

PFAS Status
PFAS-free certified: 0 points
Not certified free: 15 points
PFAS detected: 25 points (documented issue especially in period underwear)
Unknown: 10 points
Phthalates
Phthalate-free certified: 0 points
Not certified free: 8 points
Detected: 15 points
Plastic Components
Plastic applicator: 8 points
Plastic backing (pads): 8 points
Plastic wrapper: 5 points
Cardboard applicator: 2 points
Certifications & Testing
Penalty Range: 0-15 points

No third-party testing: 10 points
No ingredient disclosure: 10 points
No safety certifications (GOTS, USDA Organic, OEKO-TEX): 5 points
Packaging
Penalty Range: 0-10 points

Individual Wrapping
Unwrapped: 0 points
Paper or plant-based wrapped: 2 points
Plastic wrapped: 7 points
Outer Packaging
Plastic outer packaging: 5 additional points
Certification Bonuses (Max +10)
USDA Organic: +5 points
GOTS certified: +5 points
OEKO-TEX: +4 points
PFAS-free certified: +4 points
Third-party tested + published results: +4 points
Reusable product: +4 points
Plastic-free: +3 points
Full ingredient transparency: +3 points
B Corp: +2 points
Score Interpretation
Score Ranges
90-100: Excellent - Organic materials, no chemicals, certified safe
80-89: Good - Minimal concerns, mostly clean materials
70-79: Fair - Some material or chemical concerns
60-69: Poor - Significant chemical exposure or untested materials
Below 60: Very Poor - Multiple safety concerns, seek alternatives
Health Considerations
Common Concerns
PFAS in period underwear: Multiple brands found to contain PFAS in absorbent layers
Dioxins from bleaching: Chlorine bleaching of cotton/rayon creates dioxin residues
Pesticide residues: Conventional cotton is one of the most pesticide-intensive crops
Fragrance chemicals: Contain undisclosed endocrine disruptors in direct mucosal contact
Rayon fibers: Associated with increased TSS (Toxic Shock Syndrome) risk
Plastic applicators: Microplastic exposure during insertion
Phthalates: Found in some plastic components, known endocrine disruptors
Best Practices
Choose organic cotton products to avoid pesticide and dioxin exposure
Avoid fragranced feminine care products
Look for PFAS-free certification, especially for period underwear
Prefer unbleached or TCF-bleached products
Consider reusable options (menstrual cups, cloth pads) for reduced chemical exposure
Choose medical-grade silicone cups from reputable brands
Demand full ingredient disclosure from manufacturers
Look for GOTS, USDA Organic, or OEKO-TEX certifications
Limitations
Scores reflect available certifications and disclosed ingredients
PFAS testing is not yet standardized for all feminine care products
Vaginal absorption rates vary by individual
TSS risk factors extend beyond product materials
Comfort and effectiveness are not evaluated in health scores
Reusable products require proper cleaning to maintain safety

`,
  "Baby Care Products": `Baby Care Products Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors related to material safety, chemical exposure, and certifications. Baby care products receive enhanced scrutiny due to the vulnerability of infant skin and the prolonged contact these products have with babies.

Evaluation Factors
Our baby care scoring system evaluates products based on the following criteria:

Materials - Diaper core composition, bleaching method, top sheet, and wipe material
Chemical additives - Fragrance, preservatives, lotions, and alcohol content
PFAS & plastics - PFAS contamination, phthalates, BPA, and plastic backing
Skincare ingredients - Petroleum derivatives, SLS, PEGs, and essential oils
Certifications & testing - Third-party testing, safety certifications, and ingredient transparency
Packaging - Packaging material safety
Subcategory Weight Adjustments
Baby care products are scored with subcategory-specific weight adjustments:

Diapers & wipes: Materials 1.3x, PFAS/plastics 1.3x (prolonged skin contact)
Baby skincare: Skincare ingredients 1.5x, chemical additives 1.3x (absorption concerns)
Scoring Components
Materials
Penalty Range: 0-30 points

The materials used in baby care products are critical for infant skin safety:

Diaper Core Material
Organic cotton cloth: 0 points (safest option)
Plant-based core: 3 points (good alternative)
SAP + TCF pulp: 8 points (moderate concern)
SAP + conventional pulp: 15 points (chemical exposure risk)
Unknown: 10 points
Bleaching Method
Unbleached: 0 points (no chemical exposure)
TCF (Totally Chlorine-Free): 3 points (minimal concern)
ECF (Elemental Chlorine-Free): 8 points (moderate dioxin risk)
Chlorine bleached: 20 points (highest dioxin exposure risk)
Top Sheet Material
Cotton or bamboo: 0 points (natural, gentle on skin)
Plant-based plastic: 5 points (moderate concern)
Plastic polypropylene: 12 points (synthetic, direct skin contact)
Wipe Material
Organic cotton/bamboo: 0 points (ideal for sensitive skin)
Cotton/bamboo blend: 3 points (good option)
Viscose/rayon blend: 8 points (moderate chemical exposure)
Polyester/synthetic: 12 points (synthetic fibers against skin)
Chemical Additives
Penalty Range: 0-35 points

Chemical additives in baby products are concerning due to infant skin sensitivity:

Synthetic fragrance: 25 points (major endocrine disruptor concern)
Formaldehyde releasers: 25 points (known carcinogen)
Parabens: 20 points (endocrine disruption risk)
MIT/CMIT preservatives: 20 points (contact allergen)
Petroleum-based lotion: 15 points (potential contaminant exposure)
Alcohol: 12 points (skin irritation and drying)
Phenoxyethanol: 10 points (moderate preservative concern)
Sodium benzoate + citric acid: 5 points (may form benzene under heat)
Aloe/vitamin coating: 3 points (unnecessary additive)
Potassium sorbate: 3 points (mild preservative)
PFAS & Plastics
Penalty Range: 0-25 points

PFAS and plastic contamination are serious concerns for baby products:

PFAS Status
PFAS-free certified: 0 points
Not certified free: 15 points (unknown exposure risk)
PFAS detected: 25 points (confirmed contamination)
Phthalate Status
Phthalate-free certified: 0 points
Not certified free: 10 points
Detected: 20 points (endocrine disruptor)
BPA Status
BPA/BPS-free: 0 points
Not certified free: 5 points
Present: 10 points
Plastic Backing
Cloth/reusable: 0 points
Plant-based plastic: 3 points
Petroleum plastic: 8 points
Skincare Ingredients
Penalty Range: 0-25 points

For baby skincare products, these ingredients are evaluated:

Petrolatum: 15 points (petroleum byproduct, contamination risk)
Mineral oil: 15 points (similar concerns to petrolatum)
Artificial dyes: 15 points (unnecessary chemical exposure)
Paraffin: 12 points (petroleum derivative)
SLS (Sodium Lauryl Sulfate): 12 points (skin irritant)
SLES: 10 points (potential 1,4-dioxane contamination)
PEGs: 10 points (potential contaminants)
Propylene glycol: 8 points (skin penetration enhancer)
Essential oils (high concentration): 8 points (sensitization risk for infants)
Essential oils (low concentration): 3 points
Certifications & Testing
Penalty Range: 0-15 points

No third-party testing: 10 points
No ingredient disclosure: 10 points
Dermatologist tested only: 5 points (less rigorous than third-party)
No safety certifications: 5 points
Packaging
Penalty Range: 0-10 points

Wipe Packaging
Recyclable: 0 points
Plastic pouch: 5 points
Plastic tub: 7 points
Skincare Packaging
Glass or aluminum: 0 points
Plastic tube or bottle: 5 points
Certification Bonuses (Max +10)
Products with verified certifications receive score bonuses:

MADE SAFE: +5 points (comprehensive safety verification)
EWG Verified: +5 points (Environmental Working Group standard)
USDA Organic: +4 points
GOTS (Global Organic Textile Standard): +4 points
PFAS-free certified: +4 points
Reusable cloth: +4 points
OEKO-TEX certified: +3 points
Fragrance-free: +3 points
TCF/unbleached: +3 points
Full transparency: +3 points
B Corp: +2 points
Score Interpretation
Score Ranges
90-100: Excellent - Clean materials, no harmful chemicals, verified safe
80-89: Good - Minimal concerns, mostly safe materials
70-79: Fair - Some chemical or material concerns
60-69: Poor - Significant issues with chemicals or materials
Below 60: Very Poor - Multiple safety concerns, seek alternatives
Health Considerations
Common Concerns
PFAS (forever chemicals): Found in waterproofing layers of some diapers
Dioxins: Byproduct of chlorine bleaching in pulp
Phthalates: Endocrine disruptors found in some plastic components
Fragrances: Contain undisclosed chemicals that may irritate sensitive skin
Formaldehyde: Released by certain preservatives over time
Best Practices
Choose organic cotton or plant-based materials when possible
Look for MADE SAFE or EWG Verified certifications
Avoid fragranced products for babies
Prefer TCF or unbleached products
Check for PFAS-free and phthalate-free certifications
Consider reusable cloth options for diapers
Look for full ingredient disclosure from brands
Limitations
Scores reflect available certifications and disclosed ingredients
Individual babies may have specific sensitivities
Newer materials may not have long-term safety data
Small brands may have excellent practices but lack formal certification
Manufacturing practices can vary between product batches

`,
  "Baby Formula": `Baby Formula Scoring Methodology
Everything is scored out of 100, and we penalize each item depending on several key factors. Baby formula scoring prioritizes infant safety above all other considerations.

Safety Veto System
Baby formula implements a Safety Veto: any product with an active recall is automatically assigned a score of 1. This ensures recalled products are never recommended, regardless of their other qualities.

Evaluation Factors
Our baby formula scoring system evaluates products based on the following criteria:

Safety recalls - Active recall status (overrides all other scoring)
Harmful ingredients - Problematic ingredients like palm oil, corn syrup, synthetic additives
Ingredient severity - Per-ingredient safety analysis using food-grade guidelines
Packaging - BPA-free status and recyclability
Lab testing - Whether the product has verified lab reports
Scoring Components
Safety Veto (Recall Check)
Impact: Automatic score of 1 if triggered

Before any scoring begins, the system checks for active recalls:

Active recall found: Score is forced to 1 (lowest possible)
Recall ID present but record unverifiable: Score is forced to 1 (safety-first approach)
No active recalls: Normal scoring proceeds
This safety-first approach ensures that no recalled formula product can receive a passing score.

Harmful Ingredients Assessment
Penalty Range: 0-35 points

Specific problematic ingredients are checked:

Corn syrup: 15 points (nutritionally inferior sweetener, linked to metabolic concerns)
Palm oil: 10 points (reduces calcium and fat absorption in infants)
Synthetic additives: 10 points (artificial or synthetic ingredients)
Ingredient Severity Analysis
All ingredients are individually analyzed using food-grade safety calculations:

Each ingredient receives a severity score based on health impact
Food-specific guidelines (MADL) are used when available
Contaminants receive enhanced scrutiny with higher multipliers
The total penalty is capped to prevent scores below 1
Packaging Assessment
Penalty Range: 0-15 points

Formula packaging is evaluated for chemical safety:

Not BPA-free: 10 points (BPA is an endocrine disruptor)
Not recyclable: 5 points (environmental and material quality indicator)
Lab Testing
Penalty: 15 points if not tested

Products without verified lab reports receive a 15-point penalty, as third-party testing is critical for infant safety.

Score Interpretation
Score Ranges
90-100: Excellent - Clean ingredients, no recalls, safe packaging
80-89: Good - Minor concerns, generally safe for infants
70-79: Fair - Some ingredient concerns, consider alternatives
60-69: Poor - Significant issues, consult pediatrician
Below 60: Very Poor - Major safety concerns, avoid
Score of 1: Product has an active recall - do not use
Health Considerations
Common Concerns
Recalls: FDA recalls for contamination, nutrient deficiency, or manufacturing issues
Palm oil: Reduces calcium absorption and forms insoluble soaps in infant gut
Corn syrup solids: Nutritionally inferior to lactose as primary carbohydrate
Heavy metals: Lead, arsenic, cadmium, and mercury contamination
BPA: Endocrine disruptor found in some packaging materials
Best Practices
Always check for active recalls before purchasing
Choose formulas with lactose as primary carbohydrate when possible
Avoid palm oil when alternatives are available
Select BPA-free packaging
Look for formulas with DHA, ARA, probiotics, and prebiotics
Prefer organic and non-GMO verified options
Consult your pediatrician for personalized recommendations
Check for EU-certified formulas (stricter ingredient standards)
Limitations
Scores reflect currently available data and recall status
Individual infant needs vary significantly (consult your pediatrician)
Recall status is checked at scoring time and may change
Nutritional adequacy is not the same as ingredient safety
Some beneficial ingredients (DHA, probiotics) are noted but not scored

`,
  "Clothing & Textiles": `Clothing & Textiles Scoring Methodology
Our clothing and textiles scoring system evaluates apparel, fabrics, and textile products based on material composition and safety.

Scoring Formula
Final Score = Base Score (80 or 100) – Material Penalties

Scoring Components
Base Score
Products with harmful materials: Start at 80 points
Products without harmful materials: Start at 100 points
Material Penalties (up to 99 points)
Materials are evaluated based on their severity scores (0-5 scale):

Penalty calculation: (percentage/100) × severity_score × 20
Maximum penalty: Capped at 99 points to ensure minimum score of 1
Common Materials Evaluated
Natural Fibers

Organic cotton: Severity 0, Bonus score (sustainable, no pesticides)
Conventional cotton: Severity 1-2 (pesticide residues, water usage)
Wool: Severity 0-1 (generally safe, some processing concerns)
Silk: Severity 0-1 (generally safe)
Linen: Severity 0-1 (generally safe, sustainable)
Hemp: Severity 0, Bonus score (sustainable, low environmental impact)
Synthetic Fibers

Polyester: Severity 1-2 (microplastics, petroleum-based)
Nylon: Severity 1-2 (microplastics, chemical processing)
Acrylic: Severity 2-3 (higher chemical concerns)
Spandex/Elastane: Severity 1-2 (synthetic, generally safe)
Rayon/Viscose: Severity 1-2 (chemical processing, deforestation)
Blended Materials

Cotton-polyester blends: Combined severity based on percentages
Performance fabrics: May include multiple synthetic materials
Score Interpretation
Score Ranges
90-100: Excellent - Safe materials, minimal health concerns
75-89: Good - Minor material concerns, generally safe
60-74: Fair - Some concerning materials, consider alternatives
45-59: Concerning - Significant material concerns
0-44: Poor - Major health concerns, avoid if possible
Material-Specific Considerations
Natural Fibers
Organic Cotton
Pesticide-free: No pesticide residues
Sustainable practices: Better environmental profile
GOTS certification: Global Organic Textile Standard verification
Bonus scoring: Recognized for sustainability benefits
Conventional Cotton
Pesticide residues: May contain pesticide traces
Water usage: High water consumption concerns
Processing chemicals: Bleaching and dyeing processes
Severity scoring: Based on processing and pesticide use
Wool
Natural fiber: Generally safe material
Processing concerns: Some chemical treatments
Allergen potential: Wool allergies in some individuals
Sustainability: Renewable resource
Hemp & Linen
Sustainable: Low environmental impact
Durable: Long-lasting materials
Minimal processing: Fewer chemical treatments needed
Bonus scoring: Recognized for environmental benefits
Synthetic Fibers
Polyester
Microplastics: Sheds microplastics during washing
Petroleum-based: Non-renewable resource
Chemical processing: Various chemical treatments
Durability: Long-lasting but environmental concerns
Nylon
Microplastics: Significant microplastic shedding
Chemical processing: Requires various chemicals
Durability: Strong and durable material
Environmental impact: Non-biodegradable
Acrylic
Higher severity: More chemical concerns than other synthetics
Processing: Requires significant chemical processing
Microplastics: Contributes to microplastic pollution
Alternatives: Natural alternatives preferred
Blended Materials
Cotton-Polyester Blends
Combined scoring: Based on percentage of each material
Performance benefits: Combines natural and synthetic properties
Washing considerations: Microplastic shedding from synthetic portion
Performance Fabrics
Multiple materials: May include various synthetic fibers
Specialized treatments: Waterproofing, moisture-wicking treatments
Chemical treatments: DWR (durable water repellent) and other finishes
Health Considerations
Common Concerns
Skin irritation: Synthetic materials and chemical treatments
Microplastics: Synthetic fibers shed microplastics during washing
Chemical residues: Dyes, finishes, and processing chemicals
Allergens: Wool, latex, and other material allergies
Formaldehyde: Used in wrinkle-free and permanent press finishes
Heavy metals: Some dyes may contain heavy metals
Best Practices
Choose organic cotton or other natural fibers when possible
Prefer GOTS-certified organic textiles
Select natural fiber alternatives to synthetics
Wash new clothes before first wear to remove chemical residues
Use microfiber-catching laundry bags for synthetic garments
Look for OEKO-TEX certified products (tested for harmful substances)
Avoid wrinkle-free or permanent press finishes if sensitive
Consider second-hand clothing to reduce chemical exposure
Environmental Considerations
While environmental impact is not directly included in health scores, material choices affect both:

Microplastic pollution: Synthetic fibers contribute significantly
Water usage: Cotton production requires large amounts of water
Pesticide use: Conventional cotton uses significant pesticides
Biodegradability: Natural fibers break down more safely
Chemical processing: Fewer chemicals mean less environmental contamination
Certifications & Standards
GOTS (Global Organic Textile Standard)
Organic fiber content: Minimum organic fiber percentage required
Environmental criteria: Processing and manufacturing standards
Social criteria: Fair labor practices
OEKO-TEX Standard 100
Harmful substance testing: Tests for various harmful chemicals
Product classes: Different standards for different product types
Regular testing: Ongoing verification required
Bluesign
Environmental impact: Focuses on reducing environmental impact
Chemical management: Restricts harmful chemicals
Resource efficiency: Promotes efficient resource use
Limitations
Scores reflect material composition and available safety data
Individual sensitivities may vary significantly
Environmental impact is not included in health scores
Product durability and performance are not evaluated
Washing and care practices affect chemical exposure
Long-term health effects of some materials are still being studied

`,
} as const;

export type PromptRaceCategory = keyof typeof CATEGORY_DOCS;

export const PROMPT_RACE_CATEGORY_NAMES = Object.keys(
  CATEGORY_DOCS,
) as PromptRaceCategory[];

function normalizeCategoryName(value: string): PromptRaceCategory | null {
  const normalized = value.trim().toLowerCase();

  return (
    PROMPT_RACE_CATEGORY_NAMES.find(
      (category) => category.toLowerCase() === normalized,
    ) ?? null
  );
}

export async function loadCategoryDocs(categories: string[]) {
  const normalizedCategories = Array.from(
    new Set(
      categories
        .map((category) => normalizeCategoryName(category))
        .filter(Boolean),
    ),
  ) as PromptRaceCategory[];

  const combinedRules =
    normalizedCategories
      .map((category) => {
        const rules = CATEGORY_DOCS[category];

        return rules.trim().length
          ? `CATEGORY-SPECIFIC RULES FOR: ${category}\n${rules}`
          : `CATEGORY-SPECIFIC RULES FOR: ${category}\n[No custom rules added yet.]`;
      })
      .join("\n\n---\n\n") || "No category-specific rules were loaded.";

  return {
    categories: normalizedCategories,
    combinedRules,
  };
}
