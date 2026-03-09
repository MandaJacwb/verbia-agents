import {
  LayoutDashboard,
  Bot,
  Headphones,
  Link2,
  Target,
  DollarSign,
  Zap,
  Send,
  FileText,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Meus Agentes", url: "/agentes", icon: Bot },
  { title: "Atendimento", url: "/atendimento", icon: Headphones },
  { title: "Integrações", url: "/integracoes", icon: Link2 },
  { title: "Leads Qualificados", url: "/leads", icon: Target },
  { title: "Gestão de Envios", url: "/envios", icon: Send },
  { title: "Modelos de Mensagem", url: "/modelos", icon: FileText },
  { title: "Faturamento", url: "/faturamento", icon: DollarSign },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold font-display neon-text">
              VerbIA
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                      activeClassName="bg-accent text-primary neon-border font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="glass-card rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">VerbIA v1.0</p>
            <p className="text-xs text-primary">Agentes Inteligentes</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
