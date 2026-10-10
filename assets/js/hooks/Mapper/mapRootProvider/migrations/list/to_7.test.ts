import { to_7 } from './to_7.ts';

describe('to_7', () => {
  it('switches the animated border and outline off for settings saved before they existed', () => {
    const migrated = to_7.up({ interface: { isShowMenu: true } });

    expect(migrated.interface).toEqual({
      isShowMenu: true,
      show_animated_border: false,
      show_animated_outline: false,
      disable_animated_outlineborder: false,
    });
  });

  it('keeps what a person already chose', () => {
    const migrated = to_7.up({
      interface: { show_animated_border: true, show_animated_outline: false, disable_animated_outlineborder: true },
    });

    expect(migrated.interface).toMatchObject({
      show_animated_border: true,
      show_animated_outline: false,
      disable_animated_outlineborder: true,
    });
  });
});
