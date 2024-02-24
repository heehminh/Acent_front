export const removeUnderScore = ({keyword}: {keyword: string}) => {
    return keyword.replace(/_/g, ' ');
}