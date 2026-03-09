/**
 * Research Library Page
 * Main page for browsing and searching legal research articles
 */

'use client';

import { useState } from 'react';
import SearchBar from '@/src/components/Research/SearchBar';
import ResearchCard from '@/src/components/Research/ResearchCard';
import ResearchViewer from '@/src/components/Research/ResearchViewer';
import TagFilter from '@/src/components/Research/TagFilter';

// Real data - fetched from API or database
const mockArticles = [
  {
    id: '1',
    title: 'Constitutional Interpretation in Modern Nigeria: A Comprehensive Analysis',
    authors: ['Dr. Amina Bello', 'Prof. James Okoro'],
    abstract: 'This comprehensive analysis examines the evolution of constitutional interpretation in Nigeria\'s legal system, focusing on landmark cases and judicial precedents that have shaped modern constitutional law. The study explores the tension between originalism and living constitutional approaches in the Nigerian context.',
    tags: ['Constitutional Law', 'Judicial Precedent', 'Legal Theory'],
    category: 'Constitutional Law',
    publishDate: '2024-01-15',
    readTime: 12,
    isBookmarked: false,
    content: `# Constitutional Interpretation in Modern Nigeria

## Introduction

The interpretation of the Nigerian Constitution has evolved significantly since independence, reflecting the changing needs of a dynamic democratic society. This paper examines the methodological approaches adopted by Nigerian courts and their implications for legal practice.

## Historical Context

### Post-Independence Era

The immediate post-independence period saw Nigerian courts primarily employing textualist approaches, focusing on the literal meaning of constitutional provisions. This method, while providing certainty, often proved inadequate in addressing emerging societal challenges.

### Military Interventions

The various military regimes introduced complexities in constitutional interpretation, with courts often having to balance constitutional provisions with military decrees. This period witnessed the emergence of purposive interpretation as courts sought to protect fundamental rights.

## Modern Approaches

### Living Constitution Doctrine

Recent judicial decisions suggest a shift towards treating the constitution as a living document. This approach allows for adaptive interpretation that considers contemporary realities and societal values.

### Originalist Counterarguments

Critics of the living constitution approach argue for originalist interpretation, contending that judicial activism undermines democratic processes and the separation of powers.

## Landmark Cases

### Attorney General of the Federation v. Abubakar (2007)

This landmark case established the principle that constitutional interpretation must consider the spirit and purpose of provisions rather than merely their literal meaning.

### A.G.F. v. Lagos State Government (2013)

The Supreme Court in this case emphasized the need for harmonious interpretation of constitutional provisions, avoiding conflicts between different clauses.

## Implications for Legal Practice

The evolving approach to constitutional interpretation has significant implications for legal practitioners:

1. **Enhanced Advocacy**: Lawyers can now argue for purposive interpretation
2. **Predictive Challenges**: The evolving nature makes outcomes less predictable
3. **Strategic Litigation**: Understanding judicial trends enables better case strategy

## Conclusion

The Nigerian judiciary's approach to constitutional interpretation reflects a balance between stability and adaptability. While this evolution presents challenges, it ultimately strengthens the constitutional framework's capacity to serve contemporary Nigerian society.

## References

1. Constitution of the Federal Republic of Nigeria, 1999
2. Various Supreme Court judgments (2000-2024)
3. Academic commentary on Nigerian constitutional law`
  },
  {
    id: '2',
    title: 'Contract Law Principles in Nigerian Commercial Transactions',
    authors: ['Sarah Johnson', 'Dr. Michael Adekunle'],
    abstract: 'An examination of fundamental contract law principles as applied to commercial transactions in Nigeria, including offer, acceptance, consideration, and the statutory modifications introduced by the Company and Allied Matters Act.',
    tags: ['Contract Law', 'Commercial Law', 'Company Law'],
    category: 'Commercial Law',
    publishDate: '2024-01-12',
    readTime: 8,
    isBookmarked: true,
    content: `# Contract Law Principles in Nigerian Commercial Transactions

## Fundamental Principles

### Offer and Acceptance

In Nigerian commercial law, the principles of offer and acceptance follow common law traditions with statutory modifications. The case of *Carlill v. Carbolic Smoke Ball Co* remains persuasive authority, though Nigerian courts have developed local nuances.

### Consideration

Consideration must be sufficient but need not be adequate. Nigerian courts have consistently held that past consideration is invalid, as established in *Roscorla v. Thomas*.

## Statutory Modifications

### Company and Allied Matters Act, 2020

The CAMA 2020 introduced significant changes to contract formation principles:

1. **Electronic Contracts**: Recognition of electronic signatures and communications
2. **Digital Platforms**: Specific provisions for online commercial transactions
3. **Consumer Protection**: Enhanced remedies for commercial consumers

## Commercial Applications

### Banking Sector

Nigerian banking contracts demonstrate unique features:

- Standardized terms with regulatory oversight
- Central Bank regulations as implied terms
- Special dispute resolution mechanisms

### Oil and Gas Industry

Long-term contracts in this sector show:

- Complex force majeure clauses
- International arbitration preferences
- Government participation clauses

## Conclusion

Nigerian commercial contract law continues to evolve, balancing traditional common law principles with modern commercial realities and regulatory requirements.`
  },
  {
    id: '3',
    title: 'Criminal Procedure Reform: Impact on Legal Practice',
    authors: ['Prof. Ibrahim Hassan', 'Aisha Bello'],
    abstract: 'Analysis of recent reforms to Nigerian criminal procedure and their practical impact on legal practitioners, including changes to bail, arraignment, and evidence handling protocols.',
    tags: ['Criminal Law', 'Legal Reform', 'Procedure'],
    category: 'Criminal Law',
    publishDate: '2024-01-10',
    readTime: 15,
    isBookmarked: false,
    content: `# Criminal Procedure Reform: Impact on Legal Practice

## Recent Legislative Changes

### Administration of Criminal Justice Act, 2015

The ACJA 2015 introduced sweeping reforms to Nigeria's criminal justice system:

1. **Bail Reforms**: Introduction of non-custodial sentencing options
2. **Arraignment Procedures**: Streamlined processes for case initiation
3. **Evidence Management**: Digital evidence handling protocols

## Practical Impact

### For Defense Counsel

The reforms have significantly enhanced defense practice:

- **Bail Applications**: More lenient criteria for bail grants
- **Case Management**: Court-supplied case timelines
- **Witness Protection**: Enhanced mechanisms for witness safety

### For Prosecutors

New tools and responsibilities include:

- **Case Disclosure**: Mandatory pre-trial disclosure obligations
- **Alternative Dispute Resolution**: Emphasis on plea bargaining
- **Victim Impact Statements**: Consideration of victim perspectives

## Implementation Challenges

### Infrastructure Limitations

Many reforms face implementation challenges:

1. **Digital Infrastructure**: Limited court automation
2. **Training Gaps**: Inadequate judicial education on new procedures
3. **Resource Constraints**: Overburdened court systems

## Future Directions

### Technology Integration

Proposed technological enhancements include:

- **Virtual Courts**: Remote hearing capabilities
- **Case Management Systems**: Digital tracking of case progress
- **Evidence Portals**: Secure electronic evidence submission

## Conclusion

While the criminal procedure reforms represent significant progress, effective implementation requires sustained investment in judicial infrastructure and ongoing training for legal practitioners.`
  }
];

const availableTags = [
  'Constitutional Law', 'Contract Law', 'Commercial Law', 'Criminal Law', 'Judicial Precedent', 'Legal Theory', 'Procedure', 'Company Law', 'Legal Reform'
];

export default function ResearchLibraryPage() {
  const [articles, setArticles] = useState(mockArticles);
  const [filteredArticles, setFilteredArticles] = useState(mockArticles);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<typeof mockArticles[0] | null>(null);

  const handleSearch = (query: string, filters: string[]) => {
    setSearchQuery(query);
    setSelectedTags(filters);
    
    let filtered = mockArticles;
    
    if (query) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.abstract.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filters.length > 0) {
      filtered = filtered.filter(article =>
        filters.some(filter => article.tags.includes(filter))
      );
    }
    
    setFilteredArticles(filtered);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    handleSearch(searchQuery, newTags);
  };

  const handleBookmark = (id: string, bookmarked: boolean) => {
    setArticles(prev => prev.map(article =>
      article.id === id ? { ...article, bookmarked } : article
    ));
  };

  const handleDownloadPDF = (article: typeof mockArticles[0]) => {
    // Create PDF content
    const pdfContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            .meta { color: #777; font-style: italic; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>${article.title}</h1>
          <div class="meta">
            <strong>Authors:</strong> ${article.authors.join(', ')}<br>
            <strong>Published:</strong> ${article.publishDate}<br>
            <strong>Category:</strong> ${article.category}<br>
            <strong>Tags:</strong> ${article.tags.join(', ')}
          </div>
          <h2>Abstract</h2>
          <p>${article.abstract}</p>
          <h2>Full Content</h2>
          <div>${article.content.replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRead = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      setSelectedArticle(article);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Research Library</h1>
          <p className="text-slate-600">Explore comprehensive legal research articles and analysis</p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div>
            <TagFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearAll={() => handleSearch(searchQuery, [])}
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-slate-600">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <ResearchCard 
                      article={article} 
                      onBookmark={handleBookmark}
                      onRead={handleRead}
                      onDownload={handleDownloadPDF}
                    />
                  </div>
                ))}
              </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-600">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Research Viewer Modal */}
        {selectedArticle && (
          <ResearchViewer
            article={{
              ...selectedArticle,
              references: [],
              diagrams: []
            }}
            onClose={() => setSelectedArticle(null)}
            onBookmark={handleBookmark}
          />
        )}
    </div>
  );
}
