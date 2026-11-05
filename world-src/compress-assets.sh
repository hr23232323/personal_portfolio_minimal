#!/bin/bash
# Turns the raw Poly Haven downloads into the files in world/assets.
# Usage: ./compress-assets.sh <raw assets folder>
# Needs @gltf-transform/cli and sharp. Raw files stay out of the repo (about 176MB).
set -e
RAW=$1
OUT=$(dirname "$0")/../world/assets
mkdir -p "$OUT/models"

# Things you can inspect up close keep more texture detail.
CLOSE_UP="american_football treasure_chest wine_bottles_01 brass_goblets portable_cassette_player korean_public_payphone_01 classic_laptop"
BACKGROUND="wine_barrel_01 wooden_bookshelf_worn desk_lamp_arm_01 potted_plant_01 mid_century_lounge_chair WoodenTable_03 WoodenTable_01 wooden_picnic_table stone_fire_pit painted_wooden_bench rubber_duck_toy wall_clock dartboard wooden_lantern_01 hanging_industrial_lamp shrub_02 fern_02 rock_moss_set_01 rock_moss_set_02 boulder_01 wooden_crate_01 wicker_basket_01 throw_pillows_01 ArmChair_01 hanging_picture_frame_01 office_notepads tea_set_01 wooden_stool_01"

compress() {
    npx gltf-transform optimize "$RAW/models/$1/$1.gltf" "$OUT/$3/$1.glb" \
        --compress meshopt --texture-compress webp --texture-size "$2" \
        --simplify false --flatten false --join false --instance false --palette false
}
for name in $CLOSE_UP; do compress "$name" 1024 models; done
for name in $BACKGROUND; do compress "$name" 512 models; done

# Phones get their own set. iOS kills a tab that uses too much memory, and textures
# cost width x height x 4 bytes once decoded, however small the file is.
mkdir -p "$OUT/models-lite"
for name in $CLOSE_UP; do compress "$name" 512 models-lite; done
for name in $BACKGROUND; do compress "$name" 128 models-lite; done
