'use client';

interface BasicInfoData {
  nickname: string;
  birth_year: number | null;
  gender: 'male' | 'female' | 'other' | null;
}

interface StepBasicInfoProps {
  data: BasicInfoData;
  onUpdate: (data: Partial<BasicInfoData>) => void;
}

const GENDER_OPTIONS: { value: 'male' | 'female' | 'other'; label: string; emoji: string }[] = [
  { value: 'male', label: '남성', emoji: '👨' },
  { value: 'female', label: '여성', emoji: '👩' },
  { value: 'other', label: '기타', emoji: '🧑' },
];

export default function StepBasicInfo({ data, onUpdate }: StepBasicInfoProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">기본 정보를 알려주세요</h2>
        <p className="mt-2 text-sm text-text-light">
          맞춤형 코칭을 위해 기본 정보가 필요해요
        </p>
      </div>

      {/* Nickname */}
      <div className="space-y-2">
        <label htmlFor="nickname" className="block text-sm font-semibold text-text">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={data.nickname}
          onChange={(e) => onUpdate({ nickname: e.target.value })}
          placeholder="닉네임을 입력해주세요"
          maxLength={20}
          className="w-full rounded-xl border-2 border-cream-darker bg-white px-4 py-3.5
            text-text placeholder-text-lighter transition-colors
            focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <p className="text-xs text-text-lighter">
          {data.nickname.length}/20자
        </p>
      </div>

      {/* Birth Year */}
      <div className="space-y-2">
        <label htmlFor="birth_year" className="block text-sm font-semibold text-text">
          출생연도
        </label>
        <input
          id="birth_year"
          type="number"
          value={data.birth_year ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onUpdate({ birth_year: val ? parseInt(val, 10) : null });
          }}
          placeholder="예: 1990"
          min={1920}
          max={currentYear - 10}
          className="w-full rounded-xl border-2 border-cream-darker bg-white px-4 py-3.5
            text-text placeholder-text-lighter transition-colors
            focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {data.birth_year && (
          <p className="text-xs text-text-light">
            만 {currentYear - data.birth_year}세
          </p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text">성별</label>
        <div className="grid grid-cols-3 gap-3">
          {GENDER_OPTIONS.map((option) => {
            const isSelected = data.gender === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdate({ gender: option.value })}
                className={`
                  flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-4
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'border-primary bg-primary-50 shadow-md shadow-primary/10'
                      : 'border-cream-darker bg-white hover:border-primary-200 hover:bg-primary-50/50'
                  }
                `}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span
                  className={`text-sm font-medium ${
                    isSelected ? 'text-primary' : 'text-text-light'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
