class MasonryGrid {
  constructor({
    container,
    columnLength,
    rowGap,
    columnGap,
    minColumnWidth,
    maxColumnWidth,
    fullScreen,
  }) {
    this.container = document.getElementById(container.id);
    this.items = Array.from(this.container.querySelectorAll(".grid-item"));
    this.defaultColumnLength = columnLength;
    this.columnLength = columnLength;
    this.rowGap = rowGap;
    this.columnGap = columnGap;
    this.minColumnWidth = minColumnWidth;
    this.maxColumnWidth = maxColumnWidth;
    this.fullScreen = fullScreen;
    this.containerPadding = container.padding;
    this.containerMargin = container.margin;

    if (!this.container || this.items.length === 0) return;

    this.init();
    window.addEventListener("resize", this.init);
  }

  calculateColumnWidth() {
    const containerLRPadding = this.containerPadding * 2;
    const containerLRMargin = this.containerMargin * 2;
    const containerWidth =
      window.innerWidth - containerLRPadding - containerLRMargin;

    let columnWidth;
    this.columnLength = this.defaultColumnLength; // Reset column length to default

    do {
      // TODO: Refactor this part, width에 추가적인 값이 들어가는 듯?
      columnWidth =
        (containerWidth - (this.columnLength - 1) * this.columnGap) /
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

  getItemPosition(index, columnWidth) {
    const isSameColumn = index % this.columnLength !== 0;
    const leftPos = isSameColumn
      ? this.items[index - 1].offsetLeft + columnWidth + this.columnGap
      : this.containerPadding + this.containerMargin;

    const prevItemIndex =
      index >= this.columnLength ? index - this.columnLength : -1;
    const topPos =
      prevItemIndex >= 0
        ? this.items[prevItemIndex].offsetTop +
          this.items[prevItemIndex].offsetHeight +
          this.rowGap
        : this.containerPadding + this.containerMargin;

    return { top: topPos, left: leftPos };
  }

  setContainerHeight() {
    const maxHeight = this.items.reduce((max, item) => {
      const itemBottom = item.offsetTop + item.offsetHeight;
      return itemBottom > max ? itemBottom : max;
    }, 0);
    this.container.style.height = `${maxHeight}px`;
    this.container.style.margin = `${this.containerMargin}px`;
    this.container.style.padding = `${this.containerPadding}px`;
  }

  init = () => {
    // Bind the context of init method to the instance
    const columnWidth = this.calculateColumnWidth();

    this.items.forEach((item, index) => {
      const { top, left } = this.getItemPosition(index, columnWidth);
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
    container: {
      id: "masonryGrid",
      padding: 30,
      margin: 30,
    },
    columnLength: 3,
    rowGap: 5,
    columnGap: 10,
    minColumnWidth: 100, // 최소 너비
    maxColumnWidth: 200, // 최대 너비
    fullScreen: false,
  });
});
