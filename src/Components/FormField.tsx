interface FormFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  unit: string;
}

const FormField = ({
  label,
  value,
  onChange,
  placeholder = "0",
  unit,
}: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/80 text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          placeholder={placeholder}
          className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 placeholder:text-white/40 focus:outline-none focus:border-white/60 focus:bg-white/25 transition-all duration-200"
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="text-white/70 text-sm whitespace-nowrap w-12">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default FormField;
