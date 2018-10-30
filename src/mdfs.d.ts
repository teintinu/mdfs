//declare module 'mdfs' {

    export type MdFsTest = {
        mdfs: {
            title: string,
            file: string,
            subfolder: string,
            fullname: string,
            only?: boolean,
            pending?: boolean,
            skip?: boolean,
            errorLine: number
            error: string
        },
        throw: string,
        files: {
            [name: string]: string
        }
    }

    export function parse(text: string): MdFsTest

    export function search(folder: string, callback: (test: MdFsTest) => void)

    export function describe<A>(
        folder: string,
        expectedFileName: string,
        transformCallback: (test: MdFsTest) => A,
        title_fn?: (test: MdFsTest, folder: string) => string,
        assertion_fn?: (actual: A, expected: string, test: MdFsTest) => void,
    ): void

    export function describe<A>(
        folder: string,
        expectedFileName: string[],
        transformCallback: (test: MdFsTest) => A,
        title_fn?: (test: MdFsTest, folder: string) => string,
        assertion_fn?: (actual: A, expected: { [name: string]: string }, test: MdFsTest) => void,
    ): void

// }