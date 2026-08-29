import { NAV_ITEMS } from "../context/NavContext";
import SectionPage from "./SectionPage";

export default function Memories() {
  return <SectionPage item={NAV_ITEMS[0]} />;
}
