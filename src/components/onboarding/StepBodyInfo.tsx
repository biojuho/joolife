'use client';

interface BodyInfoData {
  height_cm: number | null;
  weight_kg: number | null;
}

interface StepBodyInfoProps {
  data: BodyInfoData;
  onUpdate: (data: Partial<BodyInfoData>) => void;
}

const HEIGHT_MIN = 120;
const HEIGHT_MAX = 220;
const WEIGHT_MIN = 30;
const WEIGHT_MAX = 150;

export default function StepBodyInfo({ data, onUpdate }: StepBodyInfoProps) {
  const height = data.height_cm ?? 170;
  const weight = data.weight_kg ?? 65;

  const bmi =
    data.height_cm && data.weight_kg
      ? (data.weight_kg / (data.height_cm / 100) ** 2).toFixed(1)
      : null;

  const getBmiLabel = (bmiValue: number): { label: string; color: string } => {
    if (bmiValue < 18.5) return { label: '저체중', color: 'text-blue-500' };
    if (bmiValue < 23) return { label: '정상', color: 'text-success' };
    if (bmiValue < 25) return { label: '과체중', color: 'text-warning' };
    return { label: '비만', color: 'text-error' };
  };

  return (
    <div className="animate-fade-in space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">신체 정보를 알려주세요</h2>
        <p className="mt-2 text-sm text-text-light">
          정확한 건강 분석을 위해 필요해요
        </p>
      </div>

      {/* Height */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <label htmlFor="height" className="text-sm font-semibold text-text">
            키
          </label>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">{height}</span>
            <span className="text-sm text-text-light">cm</span>
          </div>
        </div>

        {/* Height number input */}
        <input
          id="height"
          type="number"
          value={data.height_cm ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onUpdate({ height_cm: val ? parseInt(val, 10) : null });
          }}
          placeholder="170"
          min={HEIGHT_MIN}
          max={HEIGHT_MAX}
          className="w-full rounded-xl border-2 border-cream-darker bg-white px-4 py-3.5
            text-center text-lg text-text placeholder-text-lighter transition-colors
            focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
        />

        {/* Height slider */}
        <div className="relative px-1">
          <input
            type="range"
            min={HEIGHT_MIN}
            max={HEIGHT_MAX}
            step={1}
            value={height}
            onChange={(e) => onUpdate({ height_cm: parseInt(e.target.value, 10) })}
            className="slider-primary w-full cursor-pointer appearance-none rounded-full
              bg-cream-dark outline-none
              [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-primary
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full
              [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:appearance-none"
            style={{
              background: `linear-gradient(to right, #4A7C59 ${((height - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN)) * 100}%, #E8DFD1 ${((height - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN)) * 100}%)`,
              height: '8px',
              borderRadius: '9999px',
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-text-lighter">
            <span>{HEIGHT_MIN}cm</span>
            <span>{HEIGHT_MAX}cm</span>
          </div>
        </div>
      </div>

      {/* Weight */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <label htmlFor="weight" className="text-sm font-semibold text-text">
            체중
          </label>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">{weight}</span>
            <span className="text-sm text-text-light">kg</span>
          </div>
        </div>

        {/* Weight number input */}
        <input
          id="weight"
          type="number"
          value={data.weight_kg ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onUpdate({ weight_kg: val ? parseInt(val, 10) : null });
          }}
          placeholder="65"
          min={WEIGHT_MIN}
          max={WEIGHT_MAX}
          className="w-full rounded-xl border-2 border-cream-darker bg-white px-4 py-3.5
            text-center text-lg text-text placeholder-text-lighter transition-colors
            focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
        />

        {/* Weight slider */}
        <div className="relative px-1">
          <input
            type="range"
            min={WEIGHT_MIN}
            max={WEIGHT_MAX}
            step={1}
            value={weight}
            onChange={(e) => onUpdate({ weight_kg: parseInt(e.target.value, 10) })}
            className="w-full cursor-pointer appearance-none rounded-full
              bg-cream-dark outline-none
              [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-primary
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full
              [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:appearance-none"
            style={{
              background: `linear-gradient(to right, #4A7C59 ${((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100}%, #E8DFD1 ${((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100}%)`,
              height: '8px',
              borderRadius: '9999px',
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-text-lighter">
            <span>{WEIGHT_MIN}kg</span>
            <span>{WEIGHT_MAX}kg</span>
          </div>
        </div>
      </div>

      {/* BMI Indicator */}
      {bmi && (
        <div className="animate-scale-in rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span className="text-sm font-medium text-text-light">BMI 지수</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text">{bmi}</span>
              <span
                className={`text-sm font-semibold ${getBmiLabel(parseFloat(bmi)).color}`}
              >
                {getBmiLabel(parseFloat(bmi)).label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
