import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

global.requestAnimationFrame = cb => {
  setTimeout(cb, 0);
};

configure({ adapter: new Adapter() });
