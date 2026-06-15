# Changelog

## [Known Issues]

1. Overlay Effects added to a token will trigger the matching non-Overlay Condition to output to chat. The reverse is also true.
2. The Default/Inferred Condition Lab Mappings for game systems may not correctly import all data. Importing the map from the CUB Condition Maps folder imports correctly.
3. PF2e is not currently supported by Enhanced Conditions due to the customisation of the effects framework implemented by the system.

## [2.1.0-gygax75.6] - 2026-06-14
- Fixed a `ReferenceError` ("setProperty is not defined") thrown when editing a condition's effect in the Condition Lab on V13+ (now uses `foundry.utils.setProperty`).
- Completed the Font Awesome 6 migration: converted the remaining `fas` references (Condition Lab/Triggler chevrons and form templates) to `fa-solid`.

## [2.1.0-gygax75.5] - 2026-06-03
- Added compatibility for Foundry VTT V14.
- Updated Font Awesome icons to Version 6 standards.
- Updated module manifest to verify V14 compatibility.
- (Internal) Note: UI classes still extend the deprecated `FormApplication`; an ApplicationV2/DataModel migration is still pending.

## [1.3.1] - 2023-06-01
- Fixed an issue in the Triggler form where setting the Property 2 or Value erase one or the other.

## [1.3] - 2023-06-01
- Fixed unlinked actors not having conditions applied to them when a trigger is met.
- Fixed Overlay conditions not being applied as overlays.
- Fixed Active Effects not applying their Status Effect.
- Added an Import/Export button to the Triggler form.
- Changing a field in the Triggler form no longer resets some other fields.
- Changed a lot of title html attributes into Foundry Tooltips and removed a lot of redundant titles.
- More localization added.

## [1.2] - 2023-06-01
- Macro Configuration selector's items are now sorted (https://github.com/death-save/combat-utility-belt/issues/743).
- Saving the Macro Configuration now closes the dialog.
- Fixed an issue where the map wouldn't load due to a bad default setting.

## [1.1] - 2023-06-01
- Turned the Butler into a class to allow calling game.i18n.localize.
- Fixed the Clear Cache checkbox not showing when resetting to defaults.
- Fixed an error thrown when saving maps.
- Changed the condition rows to not "stutter" when changing the Mapping Type.

## [1.0] - 2023-05-31
- This update rewrites CUB into CLT and adds compatability for Foundry VTT V11
