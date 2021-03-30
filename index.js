const plugin = require('tailwindcss/plugin');

const remInPx = (num, name = false) => ({
    [name ? name : num]: `${num / 16}rem`,
});

const defaultOptions = {
    screens: [null, 'md', 'lg', '2xl'],
    columns: [4, 6, 12, 12],
    pageWidths: ['100vw', '100vw', '98vw', 1440],
    columnGaps: [12, 12, 12, 12],
    pageGaps: [12, 12, 12, 12],
    pageMaxWidth: 1440,
    pageMinWidth: 320,
};

module.exports = plugin.withOptions(
    function (userOptions = {}) {
        return function ({ theme, addUtilities }) {
            // Merge options
            const options = { ...defaultOptions, ...userOptions };

            // Generate media queries to place utilities in
            const mediaQueries = options.screens.reduce((acc, item) => {
                const mediaQuery = item
                    ? `@media (min-width: ${theme(`screens.${item}`)})`
                    : ``;
                acc = [...acc, mediaQuery];
                return acc;
            }, []);

            // .col and row
            addUtilities(
                {
                    '.col': {
                        boxSizing: 'content-box',
                        flexGrow: 0,
                        flexShrink: 0,
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    paddingLeft: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                    paddingRight: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.col-gapless': {
                        flexGrow: 0,
                        flexShrink: 0,
                    },
                    '.row': {
                        display: 'flex',
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    marginLeft: `${
                                        options.pageGaps[index] / 16
                                    }rem`,
                                    marginRight: `${
                                        options.pageGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.nested-row': {
                        display: 'flex',
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    marginLeft: `-${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                    marginRight: `-${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.indent-right-0': {
                        marginRight: 0,
                    },
                    '.indent-left-0': {
                        marginLeft: 0,
                    },
                },
                { variants: ['responsive'] }
            );

            // .gap-padding / .gap-margin
            addUtilities(
                {
                    '.gap-padding': {
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    padding: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.gap-padding-x': {
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    paddingLeft: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                    paddingRight: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.gap-padding-y': {
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    paddingTop: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                    paddingBottom: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.gap-margin': {
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    margin: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.gap-margin-x': {
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    marginLeft: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                    marginRight: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                    '.gap-margin-y': {
                        ...mediaQueries.reduce(
                            (acc, item, index) => ({
                                ...acc,
                                [item]: {
                                    marginTop: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                    marginBottom: `${
                                        options.columnGaps[index] / 16
                                    }rem`,
                                },
                            }),
                            {}
                        ),
                    },
                },
                { variants: ['responsive'] }
            );

            // .indent-left/right-x
            addUtilities(
                {
                    ...mediaQueries.reduce((qAcc, qItem, qIndex) => {
                        // Get columns length
                        const columns = options.columns[qIndex];

                        // Get page width
                        const pageWidth =
                            typeof options.pageWidths[qIndex] === 'string'
                                ? options.pageWidths[qIndex]
                                : `${options.pageWidths[qIndex] / 16}em`;

                        // Get page gap
                        const pageGap = `${options.pageGaps[qIndex] / 16}rem`;

                        // Generate indent rules
                        const indentRules = [...new Array(columns)].reduce(
                            (cAcc, cItem, cIndex) => {
                                // Number
                                const count = cIndex + 1;

                                // Only up to one below max
                                if (count < columns) {
                                    // Accumulate
                                    cAcc = {
                                        ...cAcc,
                                        [`.indent-left-${count}`]: {
                                            marginLeft: `calc((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count})`,
                                        },
                                        [`.indent-right-${count}`]: {
                                            marginRight: `calc((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count})`,
                                        },
                                    };
                                }

                                // Add col-half rule in half index
                                if (count === columns / 2) {
                                    // Accumulate
                                    cAcc = {
                                        ...cAcc,
                                        [`.indent-left-half`]: {
                                            marginLeft: `calc((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count})`,
                                        },
                                        [`.indent-right-half`]: {
                                            marginRight: `calc((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count})`,
                                        },
                                    };
                                }

                                return cAcc;
                            },
                            {}
                        );

                        // Accumulate
                        qAcc = {
                            ...qAcc,
                            [qItem]: indentRules,
                        };

                        return qAcc;
                    }, {}),
                },
                { variants: ['responsive'] }
            );

            // .col-x / .col-gapless-x
            addUtilities(
                {
                    ...mediaQueries.reduce((qAcc, qItem, qIndex) => {
                        // Get columns length
                        const columns = options.columns[qIndex];

                        // Get page width
                        const pageWidth =
                            typeof options.pageWidths[qIndex] === 'string'
                                ? options.pageWidths[qIndex]
                                : `${options.pageWidths[qIndex] / 16}em`;

                        // Get page min width
                        const pageMinWidth = `${options.pageMinWidth / 16}em`;

                        // Get page gap
                        const pageGap = `${options.pageGaps[qIndex] / 16}rem`;

                        // Get column gap
                        const columnGap = `${
                            options.columnGaps[qIndex] / 16
                        }rem`;

                        // Generate column rules
                        const colRules = [...new Array(columns)].reduce(
                            (cAcc, cItem, cIndex) => {
                                // Column number
                                const count = cIndex + 1;

                                // Add column rules
                                if (count <= columns) {
                                    // Accumulate
                                    cAcc = {
                                        ...cAcc,
                                        [`.col-${count}`]: {
                                            width: `calc(((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count}) - (2 * ${columnGap}))`,
                                            minWidth: `calc(((${pageMinWidth} - 2 * ${pageGap}) / ${columns} * ${count}) - (2 * ${columnGap}))`,
                                        },
                                        [`.col-gapless-${count}`]: {
                                            width: `calc(((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count}))`,
                                            minWidth: `calc(((${pageMinWidth} - 2 * ${pageGap}) / ${columns} * ${count}))`,
                                        },
                                    };
                                }

                                // Add col-full rule in last index
                                if (count === columns) {
                                    // Accumulate
                                    cAcc = {
                                        ...cAcc,
                                        [`.col-full`]: {
                                            width: `calc(((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count}) - (2 * ${columnGap}))`,
                                            minWidth: `calc(((${pageMinWidth} - 2 * ${pageGap}) / ${columns} * ${count}) - (2 * ${columnGap}))`,
                                        },
                                        [`.col-gapless-full`]: {
                                            width: `calc(((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count}))`,
                                            minWidth: `calc(((${pageMinWidth} - 2 * ${pageGap}) / ${columns} * ${count}))`,
                                        },
                                    };
                                }

                                // Add col-half rule in half index
                                if (count === columns / 2) {
                                    // Accumulate
                                    cAcc = {
                                        ...cAcc,
                                        [`.col-half`]: {
                                            width: `calc(((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count}) - (2 * ${columnGap}))`,
                                            minWidth: `calc(((${pageMinWidth} - 2 * ${pageGap}) / ${columns} * ${count}) - (2 * ${columnGap}))`,
                                        },
                                        [`.col-gapless-half`]: {
                                            width: `calc(((${pageWidth} - 2 * ${pageGap}) / ${columns} * ${count}))`,
                                            minWidth: `calc(((${pageMinWidth} - 2 * ${pageGap}) / ${columns} * ${count}))`,
                                        },
                                    };
                                }
                                return cAcc;
                            },
                            {}
                        );

                        // Accumulate
                        qAcc = {
                            ...qAcc,
                            [qItem]: colRules,
                        };

                        return qAcc;
                    }, {}),
                },
                { variants: ['responsive'] }
            );
        };
    },
    function (userOptions = {}) {
        // Merge options
        const options = { ...defaultOptions, ...userOptions };

        // column-gap-xx
        const columnGaps = options.screens.reduce(
            (acc, item, index) => ({
                ...acc,
                ...remInPx(
                    options.columnGaps[index],
                    `column-gap${item ? `-${item}` : ''}`
                ),
            }),
            {}
        );

        // page-gap-xx
        const pageGaps = options.screens.reduce(
            (acc, item, index) => ({
                ...acc,
                ...remInPx(
                    options.pageGaps[index],
                    `page-gap${item ? `-${item}` : ''}`
                ),
            }),
            {}
        );

        return {
            theme: {
                extend: {
                    spacing: {
                        ...columnGaps,
                        ...pageGaps,
                    },
                    maxWidth: {
                        ...remInPx(options.pageMaxWidth, 'page'),
                    },
                    minWidth: {
                        ...remInPx(options.pageMinWidth, 'page'),
                    },
                },
            },
        };
    }
);
