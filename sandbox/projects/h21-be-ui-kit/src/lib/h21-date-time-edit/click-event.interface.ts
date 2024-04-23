export interface IClickEvent {
  /**
   * Provides access to the widget's instance.
   */
  component: object;
  /**
   * An HTML element of the widget.
   */
  element: any;
  /**
   * Provides access to the data that is available for binding against the element. Available only in the Knockout approach.
   */
  model: object;
  /**
   * The data that is bound to the clicked item.
   */
  itemData: any;
  /**
   * An HTML element of the item.
   */
  itemElement: any;
  /**
   * Specifies the index of the clicked item.
   */
  itemIndex: number;
  /**
   * Specifies the jQuery event that caused action execution.
   */
  jQueryEvent: any;

}
