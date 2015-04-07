package cofh.thermalfoundation.plugins.mfr;

import cofh.lib.util.helpers.MathHelper;
import cofh.thermalfoundation.ThermalFoundation;
import cpw.mods.fml.common.Loader;

import powercrystals.minefactoryreloaded.api.FactoryRegistry;
import powercrystals.minefactoryreloaded.api.ValuedItem;

public class MFRPlugin {

	public static void preInit() {

		String comment;
		String category = "Plugins.MineFactoryReloaded.Straw";

		strawRedstone = ThermalFoundation.config.get(category, "Redstone", true);
		strawGlowstone = ThermalFoundation.config.get(category, "Glowstone", true);
		strawEnder = ThermalFoundation.config.get(category, "Ender", true);
		strawPyrotheum = ThermalFoundation.config.get(category, "Pyrotheum", true);
		strawCryotheum = ThermalFoundation.config.get(category, "Cryotheum", true);
		strawCoal = ThermalFoundation.config.get(category, "Coal", true);

		comment = "This controls the maximum distance (in blocks) a player will teleport from drinking Ender. (Min: 8, Max: 65536)";
		strawEnderRange = ThermalFoundation.config.get(category, "Ender.Range", strawEnderRange, comment);
		strawEnderRange = MathHelper.clampI(strawEnderRange, 8, 65536);
	}

	public static void initialize() {

	}

	public static void postInit() {

		if (Loader.isModLoaded("MineFactoryReloaded")) {
			if (strawRedstone) {
				FactoryRegistry.sendMessage("registerLiquidDrinkHandler", new ValuedItem("redstone", DrinkHandlerRedstone.instance));
			}
			if (strawGlowstone) {
				FactoryRegistry.sendMessage("registerLiquidDrinkHandler", new ValuedItem("glowstone", DrinkHandlerGlowstone.instance));
			}
			if (strawEnder) {
				FactoryRegistry.sendMessage("registerLiquidDrinkHandler", new ValuedItem("ender", DrinkHandlerEnder.instance));
			}
			if (strawPyrotheum) {
				FactoryRegistry.sendMessage("registerLiquidDrinkHandler", new ValuedItem("pyrotheum", DrinkHandlerPyrotheum.instance));
			}
			if (strawCryotheum) {
				FactoryRegistry.sendMessage("registerLiquidDrinkHandler", new ValuedItem("cryotheum", DrinkHandlerCryotheum.instance));
			}
			if (strawCoal) {
				FactoryRegistry.sendMessage("registerLiquidDrinkHandler", new ValuedItem("coal", DrinkHandlerCoal.instance));
			}
			ThermalFoundation.log.info("MineFactoryReloaded Plugin Enabled.");
		}
	}

	public static boolean strawRedstone = true;
	public static boolean strawGlowstone = true;
	public static boolean strawEnder = true;
	public static boolean strawPyrotheum = true;
	public static boolean strawCryotheum = true;
	public static boolean strawCoal = true;

	public static int strawEnderRange = 16384;

}
