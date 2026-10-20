import { SIGNATURES_GLOWINGROWS_TIMING } from '@/hooks/Mapper/constants/signatures.ts';
import { to_7 } from './to_7.ts';

describe('to_7', () => {
  it('switches the animated border and outline off for settings saved before they existed', () => {
    const migrated = to_7.up({ interface: { isShowMenu: true } });
  it('adds the default paste flash timing to signature widget settings', () => {
    const previousSettings = {
      signaturesWidget: {
        color_by_type: false,
      },
    };

    expect(to_7.up(previousSettings).signaturesWidget).toEqual({
      color_by_type: false,
      glowingrows_timing: SIGNATURES_GLOWINGROWS_TIMING.GLOWDEFAULT,
    expect(migrated.interface).toEqual({
      isShowMenu: true,
      show_animated_border: false,
      show_animated_outline: false,
      disable_animated_outlineborder: false,
    });
  });

  it('preserves an existing paste flash timing', () => {
    const previousSettings = {
      signaturesWidget: {
        glowingrows_timing: SIGNATURES_GLOWINGROWS_TIMING.GLOWEXTENDED,
      },
    };
  it('keeps what a person already chose', () => {
    const migrated = to_7.up({
      interface: { show_animated_border: true, show_animated_outline: false, disable_animated_outlineborder: true },
    });

    expect(to_7.up(previousSettings).signaturesWidget.glowingrows_timing).toBe(
      SIGNATURES_GLOWINGROWS_TIMING.GLOWEXTENDED,
    );
    expect(migrated.interface).toMatchObject({
      show_animated_border: true,
      show_animated_outline: false,
      disable_animated_outlineborder: true,
    });
  });
});
