defmodule WandererApp.Repo.Migrations.AddMapSystemLabels do
  @moduledoc """
  Moves system-label definitions from per-user JSON settings to one server-side value per map.

  Existing labels are preserved, taken in this order: the map's saved default settings, the map
  owner's own labels, any member's labels, and finally the built-in defaults. Legacy JSON keys are
  deliberately left in place for rollback safety; application code no longer reads or writes them.

  Not every deployment saves per-user settings as a map default - the `remote_settings` column on
  `map_default_settings` is a later addition - so that source is only read where the column exists.
  """

  use Ecto.Migration

  @default_labels ~s([{"id":"a","name":"A","color":"#2d803b"},{"id":"b","name":"B","color":"#3d94af"},{"id":"c","name":"C","color":"#3d94af"},{"id":"1","name":"1","color":"#563daf"},{"id":"2","name":"2","color":"#8f3daf"},{"id":"3","name":"3","color":"#3d65af"}])

  def up do
    alter table(:maps_v1) do
      add :system_labels, :text, null: false, default: @default_labels
    end

    flush()

    sources =
      if default_remote_settings?() do
        [map_default_labels(), owner_labels(), member_labels()]
      else
        [owner_labels(), member_labels()]
      end

    execute("""
    UPDATE maps_v1 AS map
    SET system_labels = COALESCE(
      #{Enum.join(sources, ",\n")},
      '#{@default_labels}'
    )
    """)
  end

  def down do
    alter table(:maps_v1) do
      remove :system_labels
    end
  end

  defp default_remote_settings? do
    %{rows: rows} =
      repo().query!("""
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'map_default_settings' AND column_name = 'remote_settings'
      """)

    rows != []
  end

  defp map_default_labels do
    """
    (
      SELECT defaults.remote_settings::jsonb->'system_labels'
      FROM map_default_settings AS defaults
      WHERE defaults.map_id = map.id
        AND defaults.remote_settings IS NOT NULL
        AND jsonb_typeof(defaults.remote_settings::jsonb->'system_labels') = 'array'
        AND jsonb_array_length(defaults.remote_settings::jsonb->'system_labels') > 0
      LIMIT 1
    )::text
    """
  end

  # the person who owns the map is the one whose labels the map was most likely built around
  defp owner_labels do
    """
    (
      SELECT settings.settings::jsonb->'system_labels'
      FROM map_user_settings_v1 AS settings
      JOIN character_v1 AS owner ON owner.user_id = settings.user_id
      WHERE settings.map_id = map.id
        AND owner.id = map.owner_id
        AND settings.settings IS NOT NULL
        AND jsonb_typeof(settings.settings::jsonb->'system_labels') = 'array'
        AND jsonb_array_length(settings.settings::jsonb->'system_labels') > 0
      LIMIT 1
    )::text
    """
  end

  defp member_labels do
    """
    (
      SELECT settings.settings::jsonb->'system_labels'
      FROM map_user_settings_v1 AS settings
      WHERE settings.map_id = map.id
        AND settings.settings IS NOT NULL
        AND jsonb_typeof(settings.settings::jsonb->'system_labels') = 'array'
        AND jsonb_array_length(settings.settings::jsonb->'system_labels') > 0
      ORDER BY settings.id
      LIMIT 1
    )::text
    """
  end
end
