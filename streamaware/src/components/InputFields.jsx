import styles from './InputFields.module.css';

export default function InputFields({ type = 'text', placeholder, value, onChange, autoComplete }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={styles.input}
      autoComplete={autoComplete}
    />
  );
}
