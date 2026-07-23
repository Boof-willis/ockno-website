#!/usr/bin/env python3
"""Build the Ockno Operator display font from Roboto Condensed.

Requires fontTools and brotli:
    python -m pip install fonttools brotli

Usage:
    python scripts/build_ockno_operator.py path/to/RobotoCondensed[wght].ttf app/fonts
"""

from __future__ import annotations

import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


FAMILY = "Ockno Operator"
WEIGHTS = {
    500: "Medium",
    600: "Semibold",
    700: "Bold",
}
# The source is purpose-built for condensed display work. A slight widening
# keeps Ockno Operator compact without feeling editorial or compressed.
WIDTH_SCALE = 1.035


def set_name(font: TTFont, name_id: int, value: str) -> None:
    name_table = font["name"]
    name_table.removeNames(nameID=name_id)
    name_table.setName(value, name_id, 3, 1, 0x409)
    name_table.setName(value, name_id, 1, 0, 0)


def rename_font(font: TTFont, weight: int, style: str) -> None:
    postscript_family = FAMILY.replace(" ", "")
    set_name(font, 1, FAMILY)
    set_name(font, 2, style)
    set_name(font, 3, f"1.000;OCKNO;{postscript_family}-{style}")
    set_name(font, 4, f"{FAMILY} {style}")
    set_name(font, 6, f"{postscript_family}-{style}")
    set_name(font, 10, "A warm, compact display grotesk customized for Ockno.")
    set_name(
        font,
        13,
        "Licensed under the SIL Open Font License, Version 1.1. "
        "Derived from Roboto Condensed.",
    )
    set_name(font, 14, "https://openfontlicense.org")
    set_name(font, 16, FAMILY)
    set_name(font, 17, style)
    font["OS/2"].usWeightClass = weight


def signed_area(points: list[tuple[int, int]]) -> float:
    return sum(
        x1 * y2 - x2 * y1
        for (x1, y1), (x2, y2) in zip(points, points[1:] + points[:1])
    ) / 2


def make_orbital_counter(font: TTFont, glyph_name: str) -> None:
    """Offset the inner counter to create Ockno's subtle orbital asymmetry."""
    glyf = font["glyf"]
    glyph = glyf[glyph_name]
    if glyph.isComposite() or glyph.numberOfContours != 2:
        return

    coordinates, end_points, flags = glyph.getCoordinates(glyf)
    starts = [0, end_points[0] + 1]
    contours = [
        list(range(start, end + 1))
        for start, end in zip(starts, end_points)
    ]
    inner = min(
        contours,
        key=lambda indices: abs(
            signed_area([(coordinates[i][0], coordinates[i][1]) for i in indices])
        ),
    )

    x_shift = -28 if glyph_name == "O" else -20
    y_shift = -16 if glyph_name == "O" else -11
    for index in inner:
        x, y = coordinates[index]
        coordinates[index] = (x + x_shift, y + y_shift)

    glyph.coordinates = coordinates


def set_proportions(font: TTFont) -> None:
    glyf = font["glyf"]
    for glyph_name in font.getGlyphOrder():
        glyph = glyf[glyph_name]
        if glyph.isComposite():
            for component in glyph.components:
                component.x = round(component.x * WIDTH_SCALE)
        elif glyph.numberOfContours > 0:
            coordinates, end_points, flags = glyph.getCoordinates(glyf)
            for index, (x, y) in enumerate(coordinates):
                coordinates[index] = (round(x * WIDTH_SCALE), y)
            glyph.coordinates = coordinates

        advance, left_bearing = font["hmtx"][glyph_name]
        font["hmtx"][glyph_name] = (
            round(advance * WIDTH_SCALE),
            round(left_bearing * WIDTH_SCALE),
        )


def build(source: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    for weight, style in WEIGHTS.items():
        variable = TTFont(source)
        font = instantiateVariableFont(variable, {"wght": weight}, inplace=False)

        set_proportions(font)
        make_orbital_counter(font, "O")
        make_orbital_counter(font, "o")
        rename_font(font, weight, style)

        font["head"].fontRevision = 1.0
        font.flavor = "woff2"
        destination = output_dir / f"OcknoOperator-{style}.woff2"
        font.save(destination)
        print(f"Built {destination}")


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(
            "Usage: build_ockno_operator.py SOURCE_VARIABLE_TTF OUTPUT_DIRECTORY"
        )

    build(Path(sys.argv[1]), Path(sys.argv[2]))


if __name__ == "__main__":
    main()
