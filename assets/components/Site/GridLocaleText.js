export const GRID_FR_LOCALE_TEXT = {
  // Root
  noRowsLabel: 'Aucune ligne',
  noResultsOverlayLabel: 'Aucun résultat trouvé.',
  errorOverlayDefaultLabel: 'Une erreur a été rencontrée.',

  // Density selector toolbar button text
  toolbarDensity: 'Affichage',
  toolbarDensityLabel: 'Affichage',
  toolbarDensityCompact: 'Compacte',
  toolbarDensityStandard: 'Normal',
  toolbarDensityComfortable: 'Comfortable',

  // Columns selector toolbar button text
  toolbarColumns: 'Colonnes',
  toolbarColumnsLabel: 'Sélection de colonnes',

  // Filters toolbar button text
  toolbarFilters: 'Filtres',
  toolbarFiltersLabel: 'Montrer les filtres',
  toolbarFiltersTooltipHide: 'Masquer les filtres',
  toolbarFiltersTooltipShow: 'Montrer les filtres',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtres actifs` : `${count} filtre actif`,

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Télécharger au format CSV',
  toolbarExportPrint: 'Imprimer',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Rechercher une colonne',
  columnsPanelTextFieldPlaceholder: 'Nom de la colonne',
  columnsPanelDragIconLabel: 'Organiser les colonnes',
  columnsPanelShowAllButton: 'Montrer tous',
  columnsPanelHideAllButton: 'Masquer tous',

  // Filter panel text
  filterPanelAddFilter: 'Ajouter un filtre',
  filterPanelDeleteIconLabel: 'Retirer',
  filterPanelOperators: 'Opérateur',
  filterPanelOperatorAnd: 'et',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colonne',
  filterPanelInputLabel: 'valeur',
  filterPanelInputPlaceholder: 'Valeur du filtre',

  // Filter operators text
  filterOperatorContains: 'contient',
  filterOperatorEquals: 'égal',
  filterOperatorStartsWith: 'commence par',
  filterOperatorEndsWith: 'fini par',
  filterOperatorIs: 'est',
  filterOperatorNot: 'n\'est pas',
  filterOperatorAfter: 'est après',
  filterOperatorOnOrAfter: 'est là ou après',
  filterOperatorBefore: 'est avant',
  filterOperatorOnOrBefore: 'est là ou avant',
  filterOperatorIsEmpty: 'est vide',
  filterOperatorIsNotEmpty: 'n\'est pas vide',

  // Filter values text
  filterValueAny: 'n\'importe',
  filterValueTrue: 'vrai',
  filterValueFalse: 'faux',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Gerer les colonnes',
  columnMenuFilter: 'Filtres',
  columnMenuHideColumn: 'Masquer',
  columnMenuUnsort: 'Annuler le tri',
  columnMenuSortAsc: 'Trier par ordre croissant',
  columnMenuSortDesc: 'Trier par ordre décroissant',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtres actifs` : `${count} filtre actif`,
  columnHeaderFiltersLabel: 'Montrer les filtres',
  columnHeaderSortIconLabel: 'Trier',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} lignes sélectionnées`
      : `${count.toLocaleString()} ligne sélectionnée`,

  // Total rows footer text
  footerTotalRows: 'Total de lignes:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} sur ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Case sélectionnées',

  // Boolean cell text
  booleanCellTrueLabel: 'vrai',
  booleanCellFalseLabel: 'faux',

  // Actions cell more text
  actionsCellMore: 'Voir plus',

  // Tree Data
  treeDataGroupingHeaderName: 'Groupe',
  treeDataExpand: 'Voir les enfants',
  treeDataCollapse: 'Masquer les enfants',

  // Used core components translation keys
  MuiTablePagination: {},
};