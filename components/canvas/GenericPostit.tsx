import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "./FormatCanvasText";
import { ScaleOnHover } from "./entities/ScaleOnHover";

interface Rectangle {
  options?: {
    color: number;
    height: number;
    width: number;
    x: number;
    y: number;
    scale: number;
  };
  header?: string;
  content?: string;
  onPress?: () => void;
}

export function GenericPostit({
  options: options = {
    x: 0,
    y: 0,
    width: 126,
    height: 136,
    color: 0x00d889,
    scale: 1,
  },
  header: header = "Header",
  content: content = "Content",
  onPress,
}: Rectangle) {
  const rectangle = new Graphics();
  rectangle.beginFill(options.color);
  rectangle.drawRoundedRect(
    0,
    0,
    options.width * options.scale,
    options.height * options.scale,
    6 * options.scale
  );
  rectangle.endFill();

  const paddingLeft = 8;
  const paddingTop = 10;

  const width = 126;
  const defaultStyle = {
    fontFamily: "Equinor",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    wordWrapWidth: width - paddingLeft,
    wordWrap: true,
    breakWords: true,
    trim: true,
  };

  const headerText = new PIXI.Text(formatCanvasText(header, 18), defaultStyle);
  headerText.x = paddingLeft;
  headerText.y = paddingTop;
  headerText.alpha = 0.4;
  headerText.resolution = 4;

  const contentText = new PIXI.Text(formatCanvasText(content), defaultStyle);
  contentText.x = paddingLeft;
  contentText.y = 28;
  contentText.resolution = 4;

  const container = new PIXI.Container();
  container.addChild(rectangle, headerText, contentText);

  container.x = options.x;
  container.y = options.y;

  if (onPress) {
    ScaleOnHover(container);
    container.on("pointerdown", onPress);
  }

  return container;
}
