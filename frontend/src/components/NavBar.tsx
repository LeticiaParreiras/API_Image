import NiceModal from "@ebay/nice-modal-react";
import { CreatePostModal } from "../components/CreatePostModal";
import { Button } from "../shared/Button";
import { ButtonToggleTheme } from "../components/ButtonToggleTheme";
import { CirclePlus, Home, LogOut, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/AuthMutation";

export function NavBar() {
  const { username, logoutUsername } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    logoutUsername();
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 h-screen w-full md:w-64  ml-4 border-e border-border h-screen flex flex-wrap flex-col justify-center items-start p-1 gap-2 sm:p-4">
      <h3 className="hidden md:inline top-4 text-xs absolute tracking-[0.2em] text-primary uppercase">
        Fotografy
      </h3>
      <Button variant="ghost" icon={Home} onClick={()=> navigate('/home')}>Home</Button>
      {username && (
        <>
      <Button
        className="text-left"
        variant="ghost"
        icon={CirclePlus}
        onClick={() => NiceModal.show(CreatePostModal)}
      >
        <span className="hidden md:inline">Novo post</span>
      </Button>


          <Button variant="ghost" icon={User} onClick={() => navigate(`/profile/${username}`)}>
            {username}
          </Button>

          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-500/10"
            icon={LogOut}
            onClick={() => void handleLogout()}
          >
            <span className="hidden md:inline">Sair da conta</span>
          </Button>
        </>
      )}
      <div className="absolute bottom-4 right-4 ">
      <ButtonToggleTheme />

      </div>
    </nav>
  );
}
