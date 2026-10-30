import type { Category } from '../data/products';
import './DeviceModel.css';

interface DeviceModelProps {
  /** Category decides which miniature is built. */
  category: Category;
}

/**
 * Original miniature devices drawn with layered HTML and CSS.
 *
 * Everything here is decorative: the surrounding `ProductImage` owns the
 * accessible label, while this component only supplies the 3D object. Each
 * scene is built from real stacked faces and rails so the depth stays
 * readable when the idle animation turns the object.
 */
function SmartphoneModel() {
  return (
    <span className="dm dm-phone">
      <span className="dm-phone__ambient" />

      <span className="dm-phone__body">
        <span className="dm-phone__back" />
        <span className="dm-phone__rail dm-phone__rail--left" />
        <span className="dm-phone__rail dm-phone__rail--right" />

        <span className="dm-phone__front">
          <span className="dm-phone__screen">
            <span className="dm-phone__wallpaper" />
            <span className="dm-phone__camera" />
            <span className="dm-phone__sheen" />
            <span className="dm-phone__indicator" />
          </span>
        </span>

        <span className="dm-phone__key dm-phone__key--volume" />
        <span className="dm-phone__key dm-phone__key--power" />
      </span>
    </span>
  );
}

function TabletModel() {
  return (
    <span className="dm dm-tablet">
      <span className="dm-tablet__ambient" />

      <span className="dm-tablet__body">
        <span className="dm-tablet__back" />
        <span className="dm-tablet__rail dm-tablet__rail--left" />
        <span className="dm-tablet__rail dm-tablet__rail--right" />

        <span className="dm-tablet__front">
          <span className="dm-tablet__screen">
            <span className="dm-tablet__wallpaper" />
            <span className="dm-tablet__camera" />
            <span className="dm-tablet__sheen" />
          </span>
        </span>
      </span>

      <span className="dm-tablet__pencil">
        <span className="dm-tablet__pencil-tip" />
      </span>
    </span>
  );
}

function LaptopModel() {
  return (
    <span className="dm dm-laptop">
      <span className="dm-laptop__ambient" />

      <span className="dm-laptop__lid">
        <span className="dm-laptop__lid-edge" />
        <span className="dm-laptop__bezel">
          <span className="dm-laptop__screen">
            <span className="dm-laptop__notch" />
            <span className="dm-laptop__ui" />
            <span className="dm-laptop__sheen" />
          </span>
        </span>
      </span>

      <span className="dm-laptop__hinge" />

      <span className="dm-laptop__base">
        <span className="dm-laptop__deck">
          <span className="dm-laptop__keys" />
          <span className="dm-laptop__trackpad" />
        </span>
      </span>
    </span>
  );
}

function GamingModel() {
  return (
    <span className="dm dm-console">
      <span className="dm-console__ambient" />

      <span className="dm-console__body">
        <span className="dm-console__wing dm-console__wing--left" />
        <span className="dm-console__wing dm-console__wing--right" />

        <span className="dm-console__core">
          <span className="dm-console__seam" />
          <span className="dm-console__port" />
          <span className="dm-console__light" />
        </span>

        <span className="dm-console__stand" />
      </span>

      <span className="dm-gamepad">
        <span className="dm-gamepad__body">
          <span className="dm-gamepad__stick dm-gamepad__stick--left" />
          <span className="dm-gamepad__stick dm-gamepad__stick--right" />
          <span className="dm-gamepad__pad" />
          <span className="dm-gamepad__touch" />
        </span>
      </span>
    </span>
  );
}

function AccessoriesModel() {
  return (
    <span className="dm dm-acc">
      <span className="dm-acc__ambient" />
      <span className="dm-acc__cable" />
      <span className="dm-acc__plug" />

      <span className="dm-acc__case">
        <span className="dm-acc__case-lid" />
        <span className="dm-acc__case-seam" />
        <span className="dm-acc__led" />
        <span className="dm-acc__bud" />
      </span>

      <span className="dm-acc__puck">
        <span className="dm-acc__puck-top" />
        <span className="dm-acc__puck-ring" />
      </span>
    </span>
  );
}

export default function DeviceModel({ category }: DeviceModelProps) {
  return (
    <span
      className={`device-model device-model--${category}`}
      aria-hidden="true"
    >
      <span className="device-model__idle">
        <span className="device-model__respond">
          <span className="device-model__stage">
            {category === 'smartphones' && <SmartphoneModel />}
            {category === 'laptops' && <LaptopModel />}
            {category === 'tablets' && <TabletModel />}
            {category === 'gaming' && <GamingModel />}
            {category === 'accessories' && <AccessoriesModel />}
          </span>
        </span>
      </span>
    </span>
  );
}
