import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { Button } from "../shared/Button";

export function ButtonToggleTheme(){
    const { theme, toggleTheme } = useTheme()
    return(
        <Button
            aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
            variant="ghost"
            icon={theme === 'light' ? Moon : Sun}
            onClick={toggleTheme}
          />
    )
}