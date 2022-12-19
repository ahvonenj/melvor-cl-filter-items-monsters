declare type AltMagicConsumption = 'AnyItem' | 'JunkItem' | 'BarIngredientsWithCoal' | 'BarIngredientsWithoutCoal' | 'None' | 'AnySuperiorGem' | 'AnyNormalFood';
declare type AltMagicProduction = 'GP' | 'Bar' | 'RandomGem' | 'RandomSuperiorGem' | 'PerfectFood' | 'RandomShards' | 'MagicXP';
/** Determines which items are consumed by an alt. magic spell */
declare enum AltMagicConsumptionID {
    AnyItem = -1,
    JunkItem = -2,
    BarIngredientsWithCoal = -3,
    BarIngredientsWithoutCoal = -4,
    None = -5,
    AnySuperiorGem = -6,
    AnyNormalFood = -7
}
declare enum AltMagicProductionID {
    GP = -1,
    Bar = -2,
    RandomGem = -3,
    RandomSuperiorGem = -4,
    PerfectFood = -5,
    RandomShards = -6,
    MagicXP = -7
}
interface AltMagicSpellData extends BaseSpellData {
    description: string;
    baseExperience: number;
    fixedItemCosts?: IDQuantity[];
    specialCost: {
        type: AltMagicConsumption;
        quantity: number;
    };
    produces: AltMagicProduction | string;
    productionRatio: number;
}
declare class AltMagicSpell extends BaseSpell {
    get name(): string;
    get description(): string;
    baseExperience: number;
    /** Item costs which are consumed per cast */
    fixedItemCosts: AnyItemQuantity[];
    /** Special costs that the spell may have */
    specialCost: {
        type: AltMagicConsumptionID;
        quantity: number;
    };
    produces: AltMagicProductionID | AnyItem;
    productionRatio: number;
    private _description;
    constructor(namespace: DataNamespace, data: AltMagicSpellData, game: Game);
}
interface MagicSkillData extends MasterySkillData {
    altSpells?: AltMagicSpellData[];
    randomShards?: DropTableData[];
}
declare class AltMagic extends CraftingSkill<AltMagicSpell, MagicSkillData> {
    get hasMastery(): boolean;
    get isCombat(): boolean;
    protected readonly _media = "assets/media/skills/magic/magic.svg";
    protected computeTotalMasteryActions(): void;
    protected getTotalUnlockedMasteryActions(): number;
    renderQueue: AltMagicRenderQueue;
    smithingBarRecipes: SmithingRecipe[];
    get actionInterval(): number;
    protected get actionLevel(): number;
    protected get masteryAction(): AltMagicSpell;
    protected get masteryModifiedInterval(): number;
    protected get noCostsMessage(): string;
    private get noRunesMessage();
    /** Base interval of casting a spell in ms */
    private readonly baseInterval;
    /** Currently selected spell. Undefined if none is selected */
    private selectedSpell?;
    get activeSpell(): AltMagicSpell;
    /** Currently selected smithing recipe for superheat. Undefined if none is selected */
    private selectedSmithingRecipe?;
    /** Currently selected itemID to convert. Undefined if none is selected */
    selectedConversionItem?: AnyItem;
    private get runePreservationChance();
    get selectedSpellMedia(): string;
    constructor(namespace: DataNamespace, game: Game);
    registerData(namespace: DataNamespace, data: MagicSkillData): void;
    postDataRegistration(): void;
    /** Callback for when the cast button is clicked */
    castButtonOnClick(): void;
    /** Callback for when a spell is clicked */
    selectSpellOnClick(spell: AltMagicSpell): void;
    /** Callback for when the select item menu is clicked */
    openSelectItemOnClick(): void;
    /** Callback for when an item is clicked */
    selectItemOnClick(item: AnyItem): void;
    /** Callback for when a superheat recipe is clicked */
    selectBarOnClick(recipe: SmithingRecipe): void;
    /** Gets the material costs to cast superheat.
     * @param useCoal Will ignore Coal_Ore costs of the recipe if true
     */
    private getSuperheatBarCosts;
    /** Gets the rune costs required to cast the currently selected spell */
    getCurrentRecipeRuneCosts(): Costs;
    getCurrentRecipeCosts(): Costs;
    getCurrentRecipeBaseProducts(): ItemCurrencyObject;
    protected getPreservationChance(action: AltMagicSpell, chance: number): number;
    getXPModifier(masteryAction?: AltMagicSpell): number;
    protected recordCostConsumptionStats(costs: Costs): void;
    /** Left as void as it is not possible to preserve items in alt. magic */
    protected recordCostPreservationStats(costs: Costs): void;
    /** Returns the modified GP to add when casting alchemy spells */
    private getAlchemyGP;
    /** Performs the main action for Alt. Magic, stopping if required resources or runes are not met */
    protected action(): void;
    get selectedSpellDoublingChance(): number;
    private randomShardTable;
    protected preAction(): void;
    protected get actionRewards(): Rewards;
    protected postAction(): void;
    onLoad(): void;
    /** Rendering update when the use combination runes setting is changed */
    onComboRunesChange(): void;
    onPageChange(): void;
    protected onLevelUp(oldLevel: number, newLevel: number): void;
    getErrorLog(): string;
    onModifierChange(): void;
    onEquipmentChange(): void;
    render(): void;
    private renderProgressBar;
    private renderSelectedSpellImage;
    private renderSelectedSpellInfo;
    private renderQuantities;
    private renderSelectionTab;
    protected resetActionState(): void;
    encode(writer: SaveWriter): SaveWriter;
    decode(reader: SaveWriter, version: number): void;
    deserialize(reader: DataReader, version: number, idMap: NumericIDMap): void;
    protected getActionIDFromOldID(oldActionID: number, idMap: NumericIDMap): string;
    setFromOldOffline(offline: OfflineMagic, idMap: NumericIDMap): void;
    testTranslations(): void;
}
declare class AltMagicRenderQueue extends GatheringSkillRenderQueue<AltMagicSpell> {
    /** Updates the required and produced item quantities */
    quantities: boolean;
    /** Updates the currently selected spell */
    selectedSpellImage: boolean;
    /** Updates the unlocks and tooltips in the spell selection tab */
    selectionTab: boolean;
    /** Updates, the item costs/products for the spell */
    selectedSpellInfo: boolean;
}
