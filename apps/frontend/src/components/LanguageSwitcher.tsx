import { IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { countryFlag } from '@/utils/format';

// Flag is by country, not language: GB for English, RU for Russian.
const LANGS = [
  { code: 'en', label: 'English', country: 'GB' },
  { code: 'ru', label: 'Русский', country: 'RU' },
];

const Flag = ({ country }: { country: string }) => (
  <span className="text-base leading-none">{countryFlag(country)}</span>
);

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language ?? 'en';
  const active = LANGS.find((l) => l.code === current) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* The trigger shows only the flag; language names live in the menu items. */}
        <Button variant="ghost" size="icon" aria-label={active.label}>
          <Flag country={active.country} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {LANGS.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => void i18n.changeLanguage(l.code)}>
            <Flag country={l.country} />
            <span className="flex-1">{l.label}</span>
            {current === l.code ? <IconCheck className="size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
