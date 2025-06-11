import { Link, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DropdownItem = {
  title: string;
  href: string;
};

type DropdownProps = {
  label?: string;
  items: DropdownItem[];
  labelStyle?: any;
  itemStyle?: any;
};

export default function Dropdown({
  label = "Menu",
  items,
  labelStyle,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <View style={webStyles.container}>
      <Pressable onPress={() => setOpen(!open)}>
        <Text style={labelStyle}>{label}</Text>{" "}
      </Pressable>
      {open && (
        <View style={webStyles.dropdown}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              style={[webStyles.item, hovered && webStyles.hovered]}
            >
              <Text>{item.title}</Text>
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}
const webStyles = StyleSheet.create({
  container: {
    position: "relative",
    marginHorizontal: 10,
  },
  trigger: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: 34,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 140,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 999,
  },
  hovered: {
    backgroundColor: "blue",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
    transitionDuration: "350ms",
  },
});
