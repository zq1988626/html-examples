
namespace D3BA {
  export interface A1 {
  }

  /**
    * 定义局部变量
    * 
    let setting : {[property: string]: string} = {
      property:"333"
    }
  **/
  
  export class A1 {
    static setting: {[property: string]: string} = {
      property:"333"
    }
    width: number;
    height: number;
    container:HTMLElement;
    $container:HTMLElement;

    constructor(message: string) {

    }

    init(box:HTMLDivElement):void {
      this.width = $(box).width();
      this.height = $(box).width();
      this.container = box;
    }

    resize():void {
      this.width = $(this.$container).width();
      this.height = $(this.$container).width();
    }
  }
}