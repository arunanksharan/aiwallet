import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  ChartColumnIncreasing,
  ChartCandlestick,
  History,
  Settings,
  BotMessageSquare,
} from 'lucide-react';
import Image from 'next/image';

const items = [
  {
    title: 'Assistant',
    url: '#',
    icon: BotMessageSquare,
    disabled: false,
  },
  {
    title: 'Insights',
    url: '#',
    icon: ChartColumnIncreasing,
    disabled: true,
  },
  {
    title: 'Activity',
    url: '#',
    icon: ChartCandlestick,
    disabled: true,
  },
  {
    title: 'History',
    url: '#',
    icon: History,
    disabled: true,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
    disabled: true,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="flex items-center justify-center p-4">
        <Image src="/logo.png" alt="Logo" width={150} height={40} priority />
      </div>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild disabled={item.disabled}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
