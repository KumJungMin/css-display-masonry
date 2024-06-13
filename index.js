// TODO: margin 반영하기

class MasonryGrid {
  constructor({
    containerId,
    columnLength,
    rowGap,
    columnGap,
    minColumnWidth,
    maxColumnWidth,
    fullScreen,
  }) {
    this.container = document.getElementById(containerId);
    this.items = Array.from(this.container.querySelectorAll(".grid-item"));
    this.defaultColumnLength = columnLength;
    this.columnLength = columnLength;
    this.rowGap = rowGap;
    this.columnGap = columnGap;
    this.minColumnWidth = minColumnWidth;
    this.maxColumnWidth = maxColumnWidth;
    this.fullScreen = fullScreen;

    if (!this.container || this.items.length === 0) return;

    this.init();
    window.addEventListener("resize", this.init);
  }

  getComputedStyleProperty(element, property) {
    return parseFloat(
      window.getComputedStyle(element, null).getPropertyValue(property)
    );
  }

  calculateColumnWidth() {
    const containerWidth = this.fullScreen
      ? window.innerWidth
      : this.container.offsetWidth;
    const containerPaddingLeft = this.getComputedStyleProperty(
      this.container,
      "padding-left"
    );
    const containerPaddingRight = this.getComputedStyleProperty(
      this.container,
      "padding-right"
    );
    const containerMarginLeft = this.getComputedStyleProperty(
      this.container,
      "margin-left"
    );
    const containerMarginRight = this.getComputedStyleProperty(
      this.container,
      "margin-right"
    );
    let columnWidth;
    this.columnLength = this.defaultColumnLength; // Reset column length to default

    do {
      const containerWidthInner =
        containerWidth -
        containerPaddingLeft -
        containerPaddingRight -
        containerMarginLeft -
        containerMarginRight;
      columnWidth =
        (containerWidthInner - (this.columnLength - 1) * this.columnGap) /
        this.columnLength;
      if (columnWidth < this.minColumnWidth) {
        this.columnLength--;
      } else if (
        columnWidth > this.maxColumnWidth &&
        this.columnLength < this.items.length
      ) {
        this.columnLength++;
      }
    } while (
      (columnWidth < this.minColumnWidth ||
        columnWidth > this.maxColumnWidth) &&
      this.columnLength > 1
    );

    return columnWidth;
  }

  getItemPosition(index, columnWidth, containerPaddingTop, containerMarginTop) {
    const isSameColumn = index % this.columnLength !== 0;
    const leftPos = isSameColumn
      ? this.items[index - 1].offsetLeft + columnWidth + this.columnGap
      : this.getComputedStyleProperty(
          this.items[index].parentElement,
          "padding-left"
        ) +
        this.getComputedStyleProperty(
          this.items[index].parentElement,
          "margin-left"
        );

    const prevItemIndex =
      index >= this.columnLength ? index - this.columnLength : -1;
    const topPos =
      prevItemIndex >= 0
        ? this.items[prevItemIndex].offsetTop +
          this.items[prevItemIndex].offsetHeight +
          this.rowGap
        : containerPaddingTop + containerMarginTop;

    return { top: topPos, left: leftPos };
  }

  setContainerHeight() {
    const maxHeight = this.items.reduce((max, item) => {
      const itemBottom = item.offsetTop + item.offsetHeight;
      return itemBottom > max ? itemBottom : max;
    }, 0);
    this.container.style.height = `${
      maxHeight +
      this.getComputedStyleProperty(this.container, "padding-bottom") +
      this.getComputedStyleProperty(this.container, "margin-bottom")
    }px`;
  }

  init = () => {
    // Bind the context of init method to the instance
    const containerPaddingTop = this.getComputedStyleProperty(
      this.container,
      "padding-top"
    );
    const containerMarginTop = this.getComputedStyleProperty(
      this.container,
      "margin-top"
    );
    const columnWidth = this.calculateColumnWidth();

    this.items.forEach((item, index) => {
      const { top, left } = this.getItemPosition(
        index,
        columnWidth,
        containerPaddingTop,
        containerMarginTop
      );
      item.style.position = "absolute";
      item.style.width = `${columnWidth}px`;
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
    });

    this.setContainerHeight();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  new MasonryGrid({
    containerId: "masonryGrid",
    columnLength: 3,
    rowGap: 5,
    columnGap: 10,
    minColumnWidth: 100, // 최소 너비
    maxColumnWidth: 200, // 최대 너비
    fullScreen: false,
  });
});
