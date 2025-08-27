export interface TabItem {
  id: string;
  label: string;
  to?: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'pill';
  ariaLabel?: string;
  className?: string;
}