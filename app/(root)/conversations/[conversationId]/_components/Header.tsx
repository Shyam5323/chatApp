import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CircleArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string;
  name: string;
  options?: Array<{
    label: string;
    destructive: boolean;
    onClick: () => void;
  }>;
};
const Header = ({ imageUrl, name, options }: Props) => {
  return (
    <Card className="flex flex-row items-start justify-between p-2 rounded-lg w-full">
      <div className="flex items-center gap-2">
        <Link href="/conversations" className="bloxl lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="w-8 h-8">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
      <div className="flex gap-2">
        {options ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant="secondary">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option, id) => {
                return (
                  <DropdownMenuItem
                    key={id}
                    className={cn("font-semibold", {
                      "text-destructive": option.destructive,
                    })}
                    onClick={option.onClick}
                  >
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </Card>
  );
};

export default Header;
