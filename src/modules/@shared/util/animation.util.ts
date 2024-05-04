import { AnimationType } from "../components/_types/animation/animation.type";

export class AnimationUtil {
  public static getInfiniteAnimation(animartion: AnimationType) {
    return `animate__animated animate__${animartion} animate__delay-2s animate__infinite`;
  }
}
