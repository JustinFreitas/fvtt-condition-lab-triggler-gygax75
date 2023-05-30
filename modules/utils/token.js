import { DEFAULT_CONFIG, FLAGS, NAME, SETTING_KEYS } from "../butler.js";
import { MightySummoner } from "../mighty-summoner.js";
import { Sidekick } from "../sidekick.js";

export class TokenUtility {
	/**
	 * Handle Token create hook
	 * @param {*} token
	 * @param {*} options
	 * @param {*} userId
	 * @returns {MightySummoner._createDialog | TokenUtility._processHPUpdate}
	 */
	static async _onCreateToken(token, options, userId) {
		const actor = token.actor;

		const mightySummonerSetting = Sidekick.getSetting(SETTING_KEYS.tokenUtility.mightySummoner);
		const tempCombatantSetting = Sidekick.getSetting(SETTING_KEYS.tempCombatants.enable);
		const tempCombatantFlag = token.getFlag(NAME, FLAGS.temporaryCombatants.temporaryCombatant);

		if (!actor || (tempCombatantSetting && tempCombatantFlag) || game.userId !== userId) {
			return;
		}

		const summonerFeat = Sidekick.getSetting(SETTING_KEYS.tokenUtility.mightySummonerFeat);
		const promptGmSetting = Sidekick.getSetting(SETTING_KEYS.tokenUtility.mightySummonerPromptGm);
		const shouldPromptUser = !game.user.isGM || (game.user.isGM && promptGmSetting) ? true : false;

		if (mightySummonerSetting && MightySummoner._checkForFeat(actor, summonerFeat) && shouldPromptUser) {
			return MightySummoner._createDialog(token);
		}

		if (TokenUtility._shouldRollHP(token)) {
			return TokenUtility._processHPUpdate(token, actor);
		}
	}

	/**
	 * Checks if the given token HP should be rolled
	 * @param {*} token
	 * @returns {Boolean}
	 */
	static _shouldRollHP(token) {
		const actor = token?.actor;
		const autoRollHP = Sidekick.getSetting(SETTING_KEYS.tokenUtility.autoRollHP);

		if (actor && token?.disposition === -1 && autoRollHP && !actor?.hasPlayerOwner) {
			return true;
		}

		return false;
	}

	/**
	 * Rolls for HP then updates the given token
	 * @param {*} token
	 * @param {*} actor
	 * @returns {TokenDocument.update}
	 */
	static async _processHPUpdate(token, actor = null, formula = null) {
		actor = actor ?? token?.actor;
		const newHP = await TokenUtility.rollHP(actor, formula);
		const hpUpdate = TokenUtility._buildHPData(newHP);

		if (!hpUpdate) return;

		return token.update(hpUpdate);
	}

	/**
	 * Rolls an actor's hp formula and returns an update payload with the result
	 * @param {*} actor
	 */
	static async rollHP(actor, newFormula = null) {
		const formula = newFormula || getProperty(actor, "system.attributes.hp.formula");

		if (!formula) {
			const maxHP = getProperty(actor, "system.attributes.hp.max");
			return maxHP ?? 0;
		}

		const roll = new Roll(formula);
		await roll.evaluate();
		const hideRoll = Sidekick.getSetting(SETTING_KEYS.tokenUtility.hideAutoRoll);

		await roll.toMessage(
			{
				flavor: `${actor.name} rolls for HP!`,
			},
			{
				rollMode: hideRoll ? `gmroll` : `roll`,
				speaker: ChatMessage.getSpeaker({ actor }),
			}
		);
		const hp = roll.total;

		return hp;
	}

	/**
	 * For a given hp value, build an object with hp value and max set
	 * @param {*} hp
	 */
	static _buildHPData(hp) {
		const hpData = {
			actorData: {
				data: {
					attributes: {
						hp: {
							value: hp,
							max: hp,
						},
					},
				},
			},
		};

		return hpData;
	}
}
