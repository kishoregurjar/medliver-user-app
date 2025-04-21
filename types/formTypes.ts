export type FormBaseProps = {
  label: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: string;
  className?: string;
};

export type Option = {
  label: string;
  value: string;
};
